import React, { useRef } from 'react';
import { ArrowLeft, Trash2, Download, Upload, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onReset, onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
      // Reset input so same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in pt-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Ajustes</h1>
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <div className="bg-surface border border-white/5 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <SettingsIcon size={20} />
            </div>
            <h3 className="text-white font-semibold">Gerenciar Dados</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={onExport}
              className="w-full flex items-center justify-between p-4 bg-background/50 rounded-xl border border-white/5 hover:border-primary/50 active:scale-[0.98] transition-all"
            >
              <div className="flex flex-col items-start">
                <span className="text-slate-200 font-medium text-sm">Fazer Backup</span>
                <span className="text-slate-500 text-xs mt-0.5">Salvar dados em arquivo .json</span>
              </div>
              <Download size={18} className="text-slate-400" />
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 bg-background/50 rounded-xl border border-white/5 hover:border-emerald-500/50 active:scale-[0.98] transition-all"
            >
              <div className="flex flex-col items-start">
                <span className="text-slate-200 font-medium text-sm">Restaurar Backup</span>
                <span className="text-slate-500 text-xs mt-0.5">Carregar dados de arquivo .json</span>
              </div>
              <Upload size={18} className="text-slate-400" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden" 
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-surface border border-rose-500/20 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-rose-400 font-semibold">Zona de Perigo</h3>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta ação irá apagar todas as transações e objetivos salvos no seu dispositivo. Esta ação não pode ser desfeita.
          </p>
          
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98] transition-all font-semibold text-sm"
          >
            <Trash2 size={18} />
            Apagar Todos os Dados
          </button>
        </div>
      </div>
    </div>
  );
};