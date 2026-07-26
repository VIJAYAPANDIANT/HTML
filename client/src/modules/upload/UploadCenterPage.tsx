import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, Clock, Trash2 } from 'lucide-react';

interface UploadHistoryItem {
  id: string;
  name: string;
  type: string;
  size: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Uploading';
  progress?: number;
}

export default function UploadCenterPage() {
  const [history, setHistory] = useState<UploadHistoryItem[]>([
    { id: '1', name: 'sensor_readings_q2.csv', type: 'CSV', size: '142 KB', timestamp: '2026-07-25 14:22', status: 'Success' },
    { id: '2', name: 'soil_report_zone4.pdf', type: 'PDF', size: '2.4 MB', timestamp: '2026-07-24 11:05', status: 'Success' },
    { id: '3', name: 'infestation_sample.jpg', type: 'Image', size: '1.8 MB', timestamp: '2026-07-23 09:12', status: 'Success' }
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<UploadHistoryItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type validation logic
  const validateFile = (file: File): boolean => {
    const allowedExtensions = ['csv', 'xlsx', 'xls', 'pdf', 'jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setErrorMessage(`Invalid file format: .${fileExtension || 'unknown'} is not supported. Supported extensions: CSV, Excel, PDF, Images.`);
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage('File size exceeds the 10MB limit. Select a smaller file.');
      return false;
    }
    
    setErrorMessage(null);
    return true;
  };

  // Simulate upload progress loop
  const simulateUpload = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'File';
    const fileSizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;

    const newUpload: UploadHistoryItem = {
      id: Date.now().toString(),
      name: file.name,
      type: fileExtension,
      size: fileSizeStr,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Uploading',
      progress: 0
    };

    setCurrentUpload(newUpload);

    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 10;
      setCurrentUpload(prev => {
        if (!prev) return null;
        return { ...prev, progress: progressVal };
      });

      if (progressVal >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setHistory(prevHist => [
            { ...newUpload, status: 'Success' },
            ...prevHist
          ]);
          setCurrentUpload(null);
        }, 500);
      }
    }, 200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        simulateUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        simulateUpload(file);
      }
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 pb-16">
      
      <div>
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Upload className="h-5.5 w-5.5 text-primary" />
          <span>Upload Center</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">Upload telemetry logs, soil worksheets, field reports, and crop scans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Drag & Drop Dropzone + Active progress */}
        <div className="lg:col-span-2 space-y-6">
          
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[250px] ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept=".csv, .xlsx, .xls, .pdf, .jpg, .jpeg, .png"
            />
            
            <div className="p-4 bg-background border border-border rounded-full text-muted-foreground mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>

            <p className="text-sm font-bold text-white">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-muted-foreground mt-2">Supports CSV, Excel, PDF, Images up to 10MB</p>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start space-x-2.5 text-xs text-destructive">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Active Uploading progress card */}
          {currentUpload && (
            <div className="bg-card border border-border rounded-xl p-6 shadow space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Uploading {currentUpload.name}</span>
                </span>
                <span className="text-muted-foreground">{currentUpload.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-200" 
                  style={{ width: `${currentUpload.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* AI Previews & Diagnostics Section */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI Data Diagnostics Pipeline</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upon successful file ingestion, datasets are automatically mapped through the Spring Boot service controller. AI models execute sanitization routines to identify anomaly outliers, compute trend vectors, and update risk indices.
            </p>
          </div>

        </div>

        {/* Right Column: Upload History list */}
        <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center space-x-2">
            <Clock className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Upload History</span>
          </h4>
          
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="bg-background border border-border rounded-lg p-3.5 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  <div className="p-2 bg-slate-850 rounded text-primary flex-shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block truncate max-w-[150px]" title={item.name}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      {item.size} • {item.type} • {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full min-h-[40px]">
                  <span className="text-[10px] text-secondary font-bold flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Active</span>
                  </span>
                  
                  <button 
                    onClick={() => handleDeleteHistory(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors mt-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
