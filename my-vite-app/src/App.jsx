import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [formData, setFormData] = useState(null);
  const [updateData, setUpdateData] = useState([]); // Initialize with null

  useEffect(() => {
    if (formData) {
      axios.post('http://127.0.0.1:8000/api/fileuploader/', formData)
        .then((response) => {
          console.log(response.data);
          setUpdateData(response.data); // Update state with response data
        })
        .catch(error => console.error(error));
    }
  }, [formData]);

  const fileCollector = () => {
    if (!file1 || !file2) {
      alert("Add both files");
      return;
    }

    const newFormData = new FormData();
    newFormData.append('file1', file1);
    newFormData.append('file2', file2);
    
    setFormData(newFormData); // This triggers useEffect
  };

  console.log(updateData);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col border border-gray-300 shadow-lg bg-white p-6 rounded-lg w-96">
        <h1 className='text-center text-lg font-semibold mb-4'>Solar Forecast</h1>
        <h2 className="text-lg font-semibold text-center mb-4">Upload Files</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">File 1:</label>
          <input
            type="file"
            className="border p-2 rounded w-full"
            onChange={(e) => setFile1(e.target.files[0])}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">File 2:</label>
          <input
            type="file"
            className="border p-2 rounded w-full"
            onChange={(e) => setFile2(e.target.files[0])}
          />
        </div>

        <button
          onClick={fileCollector}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>

      {/* Display the file data */}
      {updateData && updateData.file ? (
        <div className="mt-8 ">
          <a download href={updateData.file} className='bg-green-900 p-4  rounded-full'>
            Download Processed File.
          </a>
        </div>
      ) : (
        <p className=' text-2xl m-4 bg-red-900 p-3  rounded-full'>No file uploaded yet.</p>
      )}
    </div>
  );
};

export default App;
