import React, { useEffect, useState } from 'react';

export const Infra = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
      const getAllServers = async () => {
        const event = {
          instanceInfo: true,
        };

        try {
          const response = await fetch("https://kt7cw99yu6.execute-api.ap-south-1.amazonaws.com/prod", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
          });

          if (response.ok) {
            const info = await response.json();
            setData(info.body);
            
          } else {
            console.error('Error fetching data:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      getAllServers();
    }, []);



    if(data.length == 0) return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="loading loading-dots loading-lg"></div>
      </div>

    //   <div className="overflow-x-auto skeleton">
    //     <table className="table">
    //       {/* head */}
    //       <thead>
    //         <tr className='h-36'>
    //           <th></th>
    //           <th></th>
    //           <th></th>
    //           <th></th>
    //           <th></th>
    //         </tr>
    //       </thead>
    //       <tbody>
           
           
    //         <tr>
    //           <th></th>
    //           <th></th>
    //           <td></td>
    //           <td></td>
    //           <td></td>
    //         </tr>
    //         <tr>
    //           <th></th>
    //           <th></th>
    //           <td></td>
    //           <td></td>
    //           <td></td>
    //         </tr>
    //         <tr>
    //           <th></th>
    //           <th></th>
    //           <td></td>
    //           <td></td>
    //           <td></td>
    //         </tr>
    //         <tr>
    //           <th></th>
    //           <th></th>
    //           <td></td>
    //           <td></td>
    //           <td></td>
    //         </tr>
    //         <tr>
    //           <th></th>
    //           <th></th>
    //           <td></td>
    //           <td></td>
    //           <td></td>
    //         </tr>
           
    //       </tbody>
    //     </table>
    // </div>
    );


    
    return (
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Container ID</th>
              <th>Container IP</th>
              <th>Server Name</th>
              <th>Url</th>
            </tr>
          </thead>
          <tbody>
           
           {data.map((item, index) => (
            <tr key={index}>
              <th>{index+1}</th>
              <th>{item.containerID}</th>
              <td>{item.containerIP}</td>
              <td>{item.serverName}</td>
              <td className='text-blue-500 cursor-pointer'><a href={item.url} target='_blank'>{item.url}</a></td>
            </tr>
           ))}    
           
          </tbody>
        </table>
    </div>
    );
};

export default Infra;
