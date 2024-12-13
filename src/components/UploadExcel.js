// UploadExcel.js
import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const UploadExcel = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor, selecciona un archivo Excel primero.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Archivo subido y procesado exitosamente');
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            alert('Hubo un error al subir el archivo. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="upload-container">
            <h2>Subir Archivo Excel</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir y Procesar</button>
        </div>
    );
};

export default UploadExcel;
