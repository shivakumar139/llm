import React, { useState } from 'react';
import '../App.css';

function AwsServer() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const functionUrl = 'https://kt7cw99yu6.execute-api.ap-south-1.amazonaws.com/prod';

    const getAllServers = async () => {
        setLoading(true);
        try {
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ instanceInfo: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch servers');
            }

            const data = await response.json();
            setServers(data.body);
        } catch (error) {
            console.error('Error fetching servers:', error);
        } finally {
            setLoading(false);
        }
    };

    const createResource = async () => {
        const resourceType = document.getElementById('resource-type').value;
        setCreating(true);
        try {
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serverType: resourceType }),
            });

            if (!response.ok) {
                throw new Error('Failed to create server');
            }

            const data = await response.json();
            setServers((prev) => [...prev, data.body]);
        } catch (error) {
            console.error('Error creating server:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div id="aws-container">
            <h1>Create AWS Server</h1>

            <label htmlFor="resource-type">Select Server Type:</label>
            <select id="resource-type">
                <option value="nginx">Nginx</option>
                <option value="apache">Apache</option>
            </select>

            <button onClick={createResource} disabled={creating}>
                {creating ? 'Creating...' : 'Create Server'}
            </button>

            <button onClick={getAllServers} disabled={loading}>
                {loading ? 'Loading...' : 'Get All Servers'}
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Server Name</th>
                        <th>Container ID</th>
                        <th>Container IP</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.map((server, index) => (
                        <tr key={index}>
                            <td>{server.serverName}</td>
                            <td>{server.containerID}</td>
                            <td>{server.containerIP}</td>
                            <td>
                                <a href={server.url} target="_blank" rel="noopener noreferrer">
                                    {server.url}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AwsServer;
