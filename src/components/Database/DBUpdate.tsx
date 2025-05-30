import React, { useState, useEffect } from 'react';
import { getDBData, updateDBData } from '@/data/requests';
import { GetDBDataResponse, DBHoardingData, DBUpdateRequest } from '@/types/Types';
import toast from 'react-hot-toast';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
  field: string;
  hoardingId: number;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  oldValue,
  newValue,
  field,
  hoardingId
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
            <p><strong>Hoarding ID:</strong> {hoardingId}</p>
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
  const [tableData, setTableData] = useState<DBHoardingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<{field: keyof DBHoardingData, index: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    field: keyof DBHoardingData;
    index: number;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedRecords, setChangedRecords] = useState<Map<number, Partial<DBHoardingData>>>(new Map());

  const columns: { key: keyof DBHoardingData; label: string; editable: boolean }[] = [
    { key: 'hoarding_id', label: 'Hoarding ID', editable: false },
    { key: 'district', label: 'District', editable: true },
    { key: 'location_route', label: 'Location/Route', editable: true },
    { key: 'direction_route', label: 'Direction/Route', editable: true },
    { key: 'width', label: 'Width', editable: true },
    { key: 'height', label: 'Height', editable: true },
    { key: 'area', label: 'Area', editable: true },
    { key: 'type', label: 'Type', editable: true },
    { key: 'rate_sqft_1_months', label: 'Rate/Sqft 1M', editable: true },
    { key: 'rate_sqft_3_months', label: 'Rate/Sqft 3M', editable: true },
    { key: 'rate_sqft_6_months', label: 'Rate/Sqft 6M', editable: true },
    { key: 'rate_sqft_12_months', label: 'Rate/Sqft 12M', editable: true },
    { key: 'floor', label: 'Floor', editable: true },
    { key: 'hoarding_code', label: 'Hoarding Code', editable: true },
    { key: 'status', label: 'Status', editable: true },
    { key: 'available', label: 'Available', editable: true },
  ];

  useEffect(() => {
    const fetchDB = async () => {
      try {
        setLoading(true);
        const response: GetDBDataResponse = await getDBData();
        console.log("response", response);
        setTableData(response.payload.data_list_dict);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDB();
  }, []);

  const handleCellClick = (field: keyof DBHoardingData, index: number) => {
    const column = columns.find(col => col.key === field);
    if (!column?.editable) return;
    
    setEditingCell({ field, index });
    setEditValue(String(tableData[index][field] || ''));
  };

  const handleCellEdit = (field: keyof DBHoardingData, index: number) => {
    const oldValue = tableData[index][field];
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
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: keyof DBHoardingData, index: number) => {
    if (e.key === 'Enter') {
      handleCellEdit(field, index);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleBlur = (field: keyof DBHoardingData, index: number) => {
    handleCellEdit(field, index);
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
      const newData = [...tableData];
      const hoardingId = newData[pendingChange.index].hoarding_id;
      
      // Update the table data
      (newData[pendingChange.index] as any)[pendingChange.field] = pendingChange.newValue;
      setTableData(newData);
      
      // Track the change for API call
      const existingChanges = changedRecords.get(hoardingId) || {};
      const updatedChanges = {
        ...existingChanges,
        [pendingChange.field]: pendingChange.newValue
      };
      
      const newChangedRecords = new Map(changedRecords);
      newChangedRecords.set(hoardingId, updatedChanges);
      setChangedRecords(newChangedRecords);
      
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

  const saveChanges = async () => {
    try {
      setSaving(true);
    
      const apiPayload: DBUpdateRequest[] = Array.from(changedRecords.entries()).map(([hoardingId, changes]) => ({
        hoarding_id: hoardingId,
        ...changes
      }));

      const response = await updateDBData(apiPayload);
      if(response.message === "Database updated successfully") {
        toast.success('Changes saved successfully!',{
          position: "top-right",
          duration: 3000
        });
        
        setChangedRecords(new Map());
        setHasChanges(false);
      } else {
        throw new Error('Failed to update database');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error("Something went wrong, Please try again later", {
        position: "top-right",
        duration: 5000
      })
    } finally {
      setSaving(false);
    }
  };

  const renderCellValue = (value: string | number | boolean) => {
    if (value === null || value === undefined) return <span className="text-gray-400">null</span>;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading database...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Database Update</h1>
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <span className="text-sm text-gray-600">
              {changedRecords.size} record(s) modified
            </span>
          )}
          <button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
            className={`px-4 py-2 rounded font-medium ${
              hasChanges && !saving
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="overflow-auto max-h-[70vh] relative">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-20">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r min-w-[120px] ${
                      index === 0 
                        ? 'sticky left-0 z-30 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' 
                        : ''
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
              {tableData.map((row, index) => (
                <tr 
                  key={row.hoarding_id} 
                  className={`hover:bg-gray-50 ${
                    changedRecords.has(row.hoarding_id) ? 'bg-yellow-50' : ''
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${column.key}-${index}`}
                      className={`px-4 py-3 text-sm text-gray-900 border-r min-w-[120px] ${
                        column.editable ? 'cursor-pointer hover:bg-blue-50' : 'bg-gray-50'
                      } ${
                        changedRecords.has(row.hoarding_id) && 
                        changedRecords.get(row.hoarding_id)?.[column.key] !== undefined
                          ? 'bg-yellow-100 border-yellow-300'
                          : ''
                      } ${
                        colIndex === 0 
                          ? 'sticky left-0 z-10 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' 
                          : ''
                      }`}
                      onClick={() => handleCellClick(column.key, index)}
                    >
                      {editingCell?.field === column.key && editingCell?.index === index ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, column.key, index)}
                          onBlur={() => handleBlur(column.key, index)}
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div className="min-h-[24px] flex items-center justify-center">
                          {renderCellValue(row[column.key])}
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
        field={String(pendingChange?.field || '')}
        hoardingId={pendingChange ? tableData[pendingChange.index].hoarding_id : 0}
      />
    </div>
  );
};

export default DBUpdate;