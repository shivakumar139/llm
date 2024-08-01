import React, { useState } from 'react';
import { MdSend } from "react-icons/md";


function Search({ onSend, onApply }) {
    const [input, setInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        if (input.trim()) {
            await onSend(input);
            setInput('');
        }
        setLoading(false);
    };

    const handleApply = async () => {
        setApplyLoading(true);
        await onApply();
        setApplyLoading(false); 
       
    }


    return (
        <div className="search fixed bottom-0 w-full" >
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="input input-bordered w-full"
            />
            <button onClick={handleSend} className='btn mx-3'>
                {loading ? <span className="loading loading-spinner loading-md"></span>
 : <MdSend size={30}/>}</button>
            
            <button className='btn btn-info' onClick={handleApply}>
                {
                    applyLoading ? <span className="loading loading-spinner loading-md"></span> : "Apply"
                }           
                </button>
        </div>
    );
}

export default Search;