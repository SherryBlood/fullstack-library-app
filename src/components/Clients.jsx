import React, { useState } from 'react';
import FilterBar from './compclients/FilterBar';
import ClientCard from './compclients/ClientCard';
import DeleteConfirm from './DeleteConfirm'; 
import ClientFormModal from './compclients/ClientFormModal';
import IssueBookModal from './compclients/IssueBookModal';

const Clients = ({ books, onIssueSubmit, clients, setClients }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("az");
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [issueMode, setIssueMode] = useState('borrowed');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [currentClientId, setCurrentClientId] = useState(null);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({ firstName: '', lastName: '', phone: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setIsEditing(true);
    setFormData({ firstName: client.firstName, lastName: client.lastName, phone: client.phone });
    setCurrentClientId(client._id);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = true;
    if (!formData.lastName) newErrors.lastName = true;
    const phoneRegex = /^\+\d{10,15}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) newErrors.phone = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditing) {
        const response = await fetch(`http://localhost:5000/api/clients/${currentClientId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const updatedClient = await response.json();
        setClients(clients.map(c => c._id === currentClientId ? updatedClient : c));
      } else {
        const response = await fetch('http://localhost:5000/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const newClient = await response.json();
        setClients([...clients, newClient]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Ошибка сохранения клиента:", err);
    }
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await fetch(`http://localhost:5000/api/clients/${clientToDelete._id}`, {
          method: 'DELETE'
        });
        setClients(clients.filter(c => c._id !== clientToDelete._id));
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
      } catch (err) {
        console.error("Ошибка удаления:", err);
      }
    }
  };

  const handlePayFine = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${clientId}/pay-fine`, {
        method: 'POST'
      });
      const updatedClient = await response.json();
      setClients(prev => prev.map(c => c._id === clientId ? updatedClient : c));
    } catch (err) {
      console.error("Ошибка оплаты штрафа:", err);
    }
  };

  const handleIssueClick = (client) => {
    setActiveClient(client);
    setIssueMode('borrowed');
    setIsIssueModalOpen(true);
  };

  const handleReserveClick = (client) => {
    setActiveClient(client);
    setIssueMode('reserved');
    setIsIssueModalOpen(true);
  };

  const filteredClients = (clients || [])
    .filter(client => {
      const fullSearch = `${client.firstName} ${client.lastName} ${client.phone}`.toLowerCase();
      return fullSearch.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortType === 'fines') {
        return (b.hasFine === a.hasFine) ? 0 : b.hasFine ? 1 : -1;
      }
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return sortType === 'az' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  return (
    <div className="mx-auto w-full">
      <FilterBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        sortType={sortType}
        setSortType={setSortType}
        onAddClick={handleOpenAddModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map(client => (
          <ClientCard 
            key={client._id}
            client={client}
            onDelete={() => { setClientToDelete(client); setIsDeleteModalOpen(true); }}
            onEdit={() => handleOpenEditModal(client)}
            onIssue={() => handleIssueClick(client)}
            onReserve={() => handleReserveClick(client)}
            onPayFine={handlePayFine}
          />
        ))}
      </div>
      {filteredClients.length === 0 && (
         <div className="text-center py-10 rounded-2xl border-2 border-dashed border-orange-200 mt-6">
           <p className="text-orange-800/50 italic">No clients found matching your search...</p>
         </div>
      )}

      <ClientFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isEditing={isEditing}
      />

      <DeleteConfirm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={clientToDelete ? `${clientToDelete.firstName} ${clientToDelete.lastName}` : ""}
      />

      {activeClient && (
        <IssueBookModal 
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
          books={books}
          client={activeClient}
          mode={issueMode}
          onSubmit={(data) => onIssueSubmit(activeClient, data)}
        />
      )}
    </div>
  );
};

export default Clients;