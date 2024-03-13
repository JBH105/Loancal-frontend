import React, { useState, useEffect } from 'react';
import BaseURL from "../BaseURL"

interface ClientDropdownProps {
    onSelectClient: (clientId: string) => void; // Callback function to handle client selection
}

const ClientDropdown: React.FC<ClientDropdownProps> = ({ onSelectClient }) => {

    const [clients, setClients] = useState<{ id: string, fullName: string }[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');

    const mapApiResponseToFields = (apiData: any) => {
        return apiData.results.map((item: any) => ({
            id: item.ClientId,
            fullName: item.ClientName
        }));
    };

    function sortClientsAlphabetically(data: any) {
        return data.sort((a: any, b: any) => {
            const nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
            const nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1; // nameA comes first
            }
            if (nameA > nameB) {
                return 1; // nameB comes first
            }
            return 0; // names must be equal
        });
    }

    useEffect(() => {
        fetch(`${BaseURL}/api/clients`)
            .then(response => response.json())
            .then(data => {
                const sortedData = sortClientsAlphabetically(mapApiResponseToFields(data));
                setClients(sortedData);
            })
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    // Handle dropdown change and call the onSelectClient callback
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedClientId(selectedValue);
        onSelectClient(selectedValue); // Call the callback with the selected client ID
    };

    return (
        <div>
            {/* <label htmlFor="day">Clients:</label><br /> */}
            <select value={selectedClientId} className='form-select selected-filter-1' onChange={handleDropdownChange}>
                <option value="*">--ALL--</option>
                {clients.map((client, index) => (
                    <option key={index} value={client.id}>{client.fullName}</option>
                ))}
            </select>

        </div>
    );
};

export default ClientDropdown;
