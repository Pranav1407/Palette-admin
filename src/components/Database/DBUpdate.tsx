import React, { useState } from 'react';
import { data } from './Data';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
  field: string;
  index: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  oldValue,
  newValue,
  field,
  index
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Change</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Are you sure you want to change the value?
          </p>
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Field:</strong> {field}</p>
            <p><strong>Hoarding ID:</strong> {data["Hoarding Id"][index]}</p>
            <p><strong>Old Value:</strong> {String(oldValue)}</p>
            <p><strong>New Value:</strong> {String(newValue)}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const DBUpdate: React.FC = () => {
  const [tableData, setTableData] = useState(data);
  const [editingCell, setEditingCell] = useState<{field: string, index: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    field: string;
    index: number;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const allFields = Object.keys(tableData);
  const editableFields = allFields.filter(field => field !== "Hoarding Id");
  const rowCount = tableData[allFields[0]]?.length || 0;

  const handleCellClick = (field: string, index: number) => {
    // Don't allow editing of Hoarding Id
    if (field === "Hoarding Id") return;
    
    setEditingCell({ field, index });
    setEditValue(String(tableData[field][index] || ''));
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: string, index: number) => {
    if (e.key === 'Enter') {
      const oldValue = tableData[field][index];
      const newValue = convertValue(editValue, typeof oldValue);
      
      if (oldValue !== newValue) {
        setPendingChange({
          field,
          index,
          oldValue,
          newValue
        });
        setShowModal(true);
      } else {
        setEditingCell(null);
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const convertValue = (value: string, originalType: string): string | number | boolean => {
    if (originalType === 'number') {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    } else if (originalType === 'boolean') {
      return value.toLowerCase() === 'true';
    }
    return value;
  };

  const confirmChange = () => {
    if (pendingChange) {
      const newData = { ...tableData };
      newData[pendingChange.field][pendingChange.index] = pendingChange.newValue;
      setTableData(newData);
      setHasChanges(true);
    }
    setShowModal(false);
    setPendingChange(null);
    setEditingCell(null);
  };

  const cancelChange = () => {
    setShowModal(false);
    setPendingChange(null);
    setEditingCell(null);
  };

  const saveChanges = () => {
    // Here you would typically send the data to your backend
    console.log('Saving changes:', tableData);
    alert('Changes saved successfully!');
    setHasChanges(false);
  };

  const renderCellValue = (field: string, index: number) => {
    const value = tableData[field][index];
    if (value === null) return <span className="text-gray-400">null</span>;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Database Update</h1>
        <button
          onClick={saveChanges}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded font-medium ${
            hasChanges
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="overflow-auto max-h-[70vh]">
          <table>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[120px]">
                  Hoarding Id
                </th>
                {editableFields.map((field) => (
                  <th
                    key={field}
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[120px]"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {Array.from({ length: rowCount }, (_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r min-w-[120px]">
                    <div className="min-h-[24px] flex items-center justify-center">
                      {tableData["Hoarding Id"][index]}
                    </div>
                  </td>
                  {editableFields.map((field) => (
                    <td
                      key={`${field}-${index}`}
                      className="px-4 py-3 text-sm text-gray-900 cursor-pointer hover:bg-blue-50 border-r min-w-[120px]"
                      onClick={() => handleCellClick(field, index)}
                    >
                      {editingCell?.field === field && editingCell?.index === index ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, field, index)}
                          onBlur={() => setEditingCell(null)}
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div className="min-h-[24px] flex items-center justify-center">
                          {renderCellValue(field, index)}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={confirmChange}
        onCancel={cancelChange}
        oldValue={pendingChange?.oldValue || ''}
        newValue={pendingChange?.newValue || ''}
        field={pendingChange?.field || ''}
        index={pendingChange?.index || 0}
      />
    </div>
  );
};

export default DBUpdate;