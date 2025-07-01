import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { loginUser } from "@/data/requests";
import toast from "react-hot-toast";

interface AuthenticationModalProps {
  open: boolean;
  onClose: () => void;
   onContinue: (username: string, password: string) => void;
  cancelText?: string;
  continueText?: string;
}

const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  open,
  onClose,
  onContinue,
  cancelText = "Cancel",
  continueText = "Continue",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function validateNoLeadingOrTrailingSpaces(value: string) {
    if (value === "") return true;
    return /^[^\s].*[^\s]$|^[^\s]$/.test(value);
  }


  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await loginUser({ username, password });
        if (response.message === "Login successful") {
            onContinue(username, password);
            onClose();
        } else {
            toast.error("Login failed. Please check your credentials.");
        }
    } catch (error) {
        toast.error("An error occurred while logging in. Please try again.");
    } finally {
        setPassword("");
        setUsername("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Authentication required</DialogTitle>
          {/* <DialogClose asChild>
            <button
              type="button"
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close"
            >
              <X />
            </button>
          </DialogClose> */}
        </DialogHeader>
        <form className="space-y-4 mt-2" autoSave="off" autoComplete="off" onSubmit={handleContinue}>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Username</label>
            <input
              type="email"
              className="border px-2 py-1 rounded outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={e => {
                setError("");
                if (!validateNoLeadingOrTrailingSpaces(e.target.value)) {
                  setError("Username cannot have leading or trailing spaces.");
                  return;
                }
                setUsername(e.target.value)
              }}
              required
              autoFocus
              autoComplete="off"
              autoSave="off"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="border px-2 py-1 rounded outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={e => {
                setError("");
                if (!validateNoLeadingOrTrailingSpaces(e.target.value)) {
                  setError("Password cannot have leading or trailing spaces.");
                  return;
                }
                setPassword(e.target.value)
              }}
              required
              autoComplete="off"
              autoSave="off"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          <DialogFooter className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {continueText}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationModal;