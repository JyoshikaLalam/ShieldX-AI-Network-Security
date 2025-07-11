import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (data: any) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptedFileTypes = '.csv, .json',
  maxSize = 10, // 10MB default
}) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const validateFile = (file: File) => {
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !acceptedFileTypes.includes(`.${fileType}`)) {
      setError(`Invalid file type. Accepted file types: ${acceptedFileTypes}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds the maximum limit (${maxSize}MB)`);
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    setError(null);
    setSuccess(false);
    setUploading(true);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        let parsedData;
        
        if (file.name.endsWith('.csv')) {
          // Simple CSV parsing
          const lines = result.split('\n');
          const headers = lines[0].split(',');
          
          parsedData = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj: { [key: string]: string } = {};
            
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
            });
            
            return obj;
          });
        } else {
          // JSON parsing
          parsedData = JSON.parse(result);
        }
        
        onUpload(parsedData);
        setSuccess(true);
        setUploading(false);
      } catch (err) {
        setError('Failed to parse file. Please check the file format.');
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
      setUploading(false);
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      if (validateFile(droppedFile)) {
        processFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (validateFile(selectedFile)) {
        processFile(selectedFile);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors duration-300 ${
          dragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
        />
        
        <Upload className="mb-3 h-12 w-12 text-blue-500" />
        
        <p className="mb-2 text-sm font-medium text-gray-700">
          Drag & drop your file here, or{' '}
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            browse
          </label>
        </p>
        
        <p className="text-xs text-gray-500">
          Accepted file types: {acceptedFileTypes} (Max size: {maxSize}MB)
        </p>
        
        {file && !error && !success && (
          <div className="mt-4 flex items-center">
            <div className="mr-3 flex-shrink-0">
              {uploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              ) : (
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center rounded-md bg-red-50 p-3 text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center rounded-md bg-green-50 p-3 text-green-800">
          <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
          <span className="text-sm">File uploaded and processed successfully!</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;