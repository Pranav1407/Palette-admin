import React, { useState, useEffect } from 'react';
import { addDBData, deleteDBData, getDBData, updateDBData } from '@/data/requests';
import { GetDBDataResponse, DBHoardingData, DBUpdateRequest, NewHoardingRow } from '@/types/Types';
import toast from 'react-hot-toast';
import { X, Trash2 } from "lucide-react"
import AuthenticationModal from '../utils/AuthenticationModal';
import { useAuthStore } from '@/stores/authStore';

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
  const [addLoading, setAddLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCell, setEditingCell] = useState<{field: keyof DBHoardingData, index: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [pendingChange, setPendingChange] = useState<{
    field: keyof DBHoardingData;
    index: number;
    oldValue: string | number | boolean;
    newValue: string | number | boolean;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedRecords, setChangedRecords] = useState<Map<number, Partial<DBHoardingData>>>(new Map());
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"delete" | "save" | "add" | null>(null);
  const [latInput, setLatInput] = useState('');
  const [longInput, setLongInput] = useState('');
  const role = useAuthStore((state) => state.role);
  const isEditable = role === 'super_admin';
  const [newRow, setNewRow] = useState<NewHoardingRow>({
    district: '',
    location: '',
    direction_route: '',
    width: null,
    height: null,
    area: null,
    type: '',
    rate_sqft_1_months: null,
    rate_sqft_3_months: null,
    rate_sqft_6_months: null,
    rate_sqft_12_months: null,
    floor: '',
    hoarding_code: '',
    status: '',
    available: '',
    location_coordinates: latInput && longInput ? `${latInput} ${longInput}` : null,
    notes: ''
  });

  const columns: { key: keyof DBHoardingData; label: string; editable: boolean }[] = [
    { key: 'district', label: 'District', editable: isEditable },
    { key: 'location', label: 'Location/Route', editable: isEditable },
    { key: 'direction_route', label: 'Direction/Route', editable: isEditable },
    { key: 'width', label: 'Width', editable: isEditable },
    { key: 'height', label: 'Height', editable: isEditable },
    { key: 'area', label: 'Area', editable: isEditable },
    { key: 'type', label: 'Type', editable: isEditable },
    { key: 'rate_sqft_1_months', label: 'Rate/Sqft 1M', editable: true },
    { key: 'rate_sqft_3_months', label: 'Rate/Sqft 3M', editable: true },
    { key: 'rate_sqft_6_months', label: 'Rate/Sqft 6M', editable: true },
    { key: 'rate_sqft_12_months', label: 'Rate/Sqft 12M', editable: true },
    { key: 'floor', label: 'Floor', editable: isEditable },
    { key: 'hoarding_code', label: 'Hoarding Code', editable: isEditable },
    { key: 'status', label: 'Status', editable: isEditable },
    { key: 'available', label: 'Available', editable: true },
  ];

  useEffect(() => {
    const fetchDB = async () => {
      try {
        setLoading(true);
        const response: GetDBDataResponse = await getDBData();
        if(response.message === "Data Fetch successful"){
          setTableData(response.payload.data_list_dict);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if(!tableData.length) {
      fetchDB();
    }
  }, []);

  useEffect(() => {
    // Update the location_coordinates whenever latInput or longInput changes
    if (latInput && longInput) {
      const coordinates = `${latInput} ${longInput}`;
      setNewRow(prev => ({
        ...prev,
        location_coordinates: coordinates
      }));
    } else {
      setNewRow(prev => ({
        ...prev,
        location_coordinates: null
      }));
    }
  }, [latInput, longInput]);

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

  const addRow = async () => {
    try {
      setAddLoading(true);
      const response = await addDBData(newRow);
      if(response.message === "New hoarding added successfully") {
        toast.success("Row added successfully!", {
          position: "top-right",
          duration: 3000,
        });
        setTableData((prev: any) => [...prev, { ...newRow, hoarding_id: response?.payload?.hoarding_id || Math.random() }]);
        setShowAddModal(false);
        setNewRow({
          district: '',
          location: '',
          direction_route: '',
          width: null,
          height: null,
          area: null,
          type: '',
          rate_sqft_1_months: null,
          rate_sqft_3_months: null,
          rate_sqft_6_months: null,
          rate_sqft_12_months: null,
          floor: '',
          hoarding_code: '',
          status: '',
          available: '',
          location_coordinates: null,
          notes: ''
        });
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again later", {
        position: "top-right",
        duration: 5000
      })
    } finally{
      setAddLoading(false);
    }
  }

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
        setTableData(prevData =>
          prevData.map(row => {
            const changes = changedRecords.get(row.hoarding_id);
            return changes ? { ...row, ...changes } : row;
          })
        );
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

  const handleDelete = async (hoarding_id: number) => {
    try {
      const payload = { hoarding_id: hoarding_id };
      await deleteDBData(payload);
      toast.success("Row deleted successfully!", {
        position: "top-right",
        duration: 3000,
      });
      setTableData(prev => prev.filter(row => row.hoarding_id !== hoarding_id));
    } catch (error) {
      toast.error("Failed to delete row", {
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
      setAuthenticated(false);
    }
  };

  function toDMS(deg: number, isLat: boolean): string {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.round((minutesNotTruncated - minutes) * 60);

    const direction = isLat
      ? deg >= 0 ? "N" : "S"
      : deg >= 0 ? "E" : "W";

    // Example: 09°58'30" N
    return `${degrees.toString().padStart(2, "0")}°${minutes
      .toString()
      .padStart(2, "0")}'${seconds.toString().padStart(2, "0")}" ${direction}`;
  }

  const parseCoordinate = (input: string): number | null => {
    const cleaned = input.replace(/[°'"NSEW\s]/g, '');
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
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
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded font-medium bg-green-600 text-white hover:bg-green-700 ${!isEditable && 'hidden'}`}
            onClick={() => setShowAddModal(true)}
          >
            Add row
          </button>
          <div className={`flex flex-col justify-center items-center ${!isEditable && 'hidden'}`}>
            <button
              onClick={() => {
                if (!authenticated) {
                  setPendingAction("save");
                  setShowAuthModal(true);
                } else {
                  saveChanges();
                }
              }}
              disabled={!hasChanges || saving}
              className={`px-4 py-2 rounded font-medium ${
                hasChanges && !saving
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {hasChanges && (
              <span className="text-xs text-gray-600">
                {changedRecords.size} record(s) modified
              </span>
            )}
          </div>
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
                {isEditable && <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b min-w-[60px] sticky right-0 z-30 bg-gray-50"
                >
                  Action
                </th>}
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
                  {isEditable && <td
                    className="px-4 py-3 text-center sticky right-0 bg-white border-l"
                  >
                    <button
                      onClick={() => {
                        setDeleteTargetId(row.hoarding_id);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Row"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex">
              <h3 className="text-lg font-semibold mb-4">Add New Row</h3>
              <X
                className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
              />  
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (addLoading) return;
                setShowAuthModal(true);
                setPendingAction("add");
              }}
              className="space-y-3 max-h-[70vh] overflow-y-auto"
            >
              {(columns as { key: keyof NewHoardingRow; label: string; editable: boolean }[]).map((col) => (
                <div key={col.key as string} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{col.label}</label>
                  <input
                    type='text'
                    value={(newRow[col.key] as any)}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      setNewRow((prev) => ({
                        ...prev,
                        [col.key]:
                          typeof prev[col.key] === 'number'
                            ? Number(rawValue)
                            : rawValue.replace(/^\s+|\s+$/g, ""), // Trim leading/trailing spaces
                      }));
                    }}
                    className="border px-2 py-1 rounded outline-none"
                    required
                  />
                </div>
              ))}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">{`Latitude (In decimal degrees)`}</label>
                <input
                  type="text"
                  value={latInput}
                  onChange={e => {
                    if(e.target.value === '') {
                      setLatInput('');
                      return;
                    }
                    const newLat = e.target.value;
                    const numericValue = parseCoordinate(newLat);
                    if (numericValue !== null) {
                      const lat = toDMS(Number(numericValue), true);
                      setLatInput(lat);
                    }
                  }}
                  className="border px-2 py-1 rounded outline-none"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">{`Longitude (In decimal degrees)`}</label>
                <input
                  type="text"
                  value={longInput}
                  onChange={e => {
                    if(e.target.value === '') {
                      setLongInput('');
                      return;
                    }
                    const newLong = e.target.value;
                    const numericValue = parseCoordinate(newLong);
                    if (numericValue !== null) {
                      const long = toDMS(Number(numericValue), false);
                      setLongInput(long);
                    }
                  }}
                  className="border px-2 py-1 rounded outline-none"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newRow.notes || ''}
                  onChange={e => setNewRow(prev => ({ ...prev, notes: e.target.value === '' ? null : e.target.value}))}
                  className="border px-2 py-1 rounded outline-none resize-none"
                  required
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${addLoading && 'cursor-not-allowed opacity-50'}`}
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Row'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <X className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setShowDeleteConfirm(false)} />
            </div>
            <p className="mb-6">Are you sure you want to delete hoarding id <b>{deleteTargetId}</b>?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPendingAction("delete");
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={confirmChange}
        onCancel={cancelChange}
        oldValue={pendingChange?.oldValue || ''}
        newValue={pendingChange?.newValue || ''}
        field={String(pendingChange?.field || '')}
        hoardingId={pendingChange ? tableData[pendingChange.index].hoarding_id : 0}
      />

      <AuthenticationModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onContinue={(_username, _password) => {
          setAuthenticated(true);
          setShowAuthModal(false);
          if (pendingAction === "delete" && deleteTargetId) {
            handleDelete(deleteTargetId);
          }
          if (pendingAction === "save") {
            saveChanges();
          }
          if (pendingAction === "add") {
            addRow();
          }
          setPendingAction(null);
        }}
        cancelText="Cancel"
        continueText="Authenticate"
      />
    </div>
  );
};

export default DBUpdate;