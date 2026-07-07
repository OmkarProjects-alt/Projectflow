import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeProvider'
import { X, Search, UserPlus, Mail, Check, Loader2, Users, Send } from 'lucide-react'
import { searchProjectMembers } from "../../services/users.service"
import { inviteMembers } from "../../services/project.service";
import { useError } from "../../context/ErrorAndSuccessMsgContext";

const InviteMembersModal = ({ isOpen, onClose, onInvite, existingUsers = [], projectId }) => {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [inviteSent, setInviteSent] = useState(false)
  const searchInputRef = useRef(null)

  const { addMessage } = useError();

  // Mock users data - replace with your actual API call
  const mockUsers = [
    { uid: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: '', role: 'Developer' },
    { uid: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: '', role: 'Designer' },
    { uid: '3', name: 'Carol White', email: 'carol@example.com', avatar: '', role: 'Manager' },
    { uid: '4', name: 'David Brown', email: 'david@example.com', avatar: '', role: 'Developer' },
    { uid: '5', name: 'Eve Davis', email: 'eve@example.com', avatar: '', role: 'QA' },
  ]

  // Filter out existing users
  const availableUsers = mockUsers.filter(
    user => !existingUsers.some(existing => existing.uid === user.uid)
  )

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
      setInviteSent(false)
      setSelectedUsers([])
      setSearchQuery('')
      setSearchResults([])
    }
  }, [isOpen])

  useEffect(() => {

    if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
    }

    const timeout = setTimeout(async () => {

        try {

            setLoading(true);

            const result =
                await searchProjectMembers(
                    projectId,
                    searchQuery
                );

            if (result.data.success) {
                setSearchResults(result.data.users);
            }

        } catch (err) {

            console.log(err);

            setSearchResults([]);

        } finally {

            setLoading(false);

        }

    }, 350);

    return () => clearTimeout(timeout);

  }, [searchQuery]);

  const handleSelectUser = (user) => {
    if (selectedUsers.some(u => u.uid === user.uid)) {
      setSelectedUsers(selectedUsers.filter(u => u.uid !== user.uid))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.uid !== userId))
  }

  const handleAddEmail = () => {
    if (emailInput.trim() && !selectedUsers.some(u => u.email === emailInput)) {
      setSelectedUsers([
        ...selectedUsers,
        { uid: `email-${Date.now()}`, name: emailInput, email: emailInput, isEmail: true }
      ])
      setEmailInput('')
    }
  }

  const handleInvite = async () => {

    if (selectedUsers.length === 0) return;

    try {

        setInviting(true);

        const memberIds = selectedUsers.map(
            (user) => user.uid
        );

        const result = await inviteMembers({
            projectId,
            members: selectedUsers.map(user => user.uid),
        });

        if (result.data.success) {

            addMessage(
                result.data.message,
                true
            );

            setInviteSent(true);

            onInvite?.(selectedUsers);

            setTimeout(() => {
                onClose();
            }, 1500);
        }

    } catch (error) {

        addMessage(
            error?.response?.data?.message ||
            "Failed to invite members."
        );

    } finally {
        setInviting(false);
    }

  };

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className={`
          w-full max-w-lg
          ${theme.card.modal}
          max-h-[90vh]
          overflow-hidden
          flex flex-col
          transition-all
          duration-300
          scale-100
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`
          flex items-center justify-between
          px-6 py-4
          ${theme.table.divider}
          border-b
          flex-shrink-0
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-lg
              bg-blue-500/10
              ${theme.text.info}
            `}>
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                Invite Team Members
              </h2>
              <p className={`${theme.text.muted} text-xs`}>
                Add new members to your team
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`
              p-1.5 rounded-lg
              ${theme.text.muted}
              hover:${theme.text.primary}
              hover:bg-gray-200/20
              dark:hover:bg-gray-800/50
              transition-all
              duration-200
              cursor-pointer
            `}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {inviteSent ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`
                p-4 rounded-full
                bg-green-500/10
                ${theme.text.success}
                mb-4
              `}>
                <Check size={48} />
              </div>
              <h3 className={`text-xl font-semibold ${theme.text.primary}`}>
                Invites Sent!
              </h3>
              <p className={`${theme.text.muted} text-sm mt-2 text-center max-w-sm`}>
                {selectedUsers.length} invitation{selectedUsers.length > 1 ? 's' : ''} sent successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className={`
                  absolute left-3 top-1/2 -translate-y-1/2
                  ${theme.text.muted}
                  h-4 w-4
                `} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5
                    ${theme.input.input}
                    rounded-lg
                    text-sm
                    transition-all
                    duration-200
                    focus:ring-2
                    focus:ring-blue-500/50
                  `}
                />
              </div>

              {/* Email Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Enter email directly..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddEmail()
                    }
                  }}
                  className={`
                    flex-1 px-4 py-2
                    ${theme.input.input}
                    rounded-lg
                    text-sm
                    transition-all
                    duration-200
                    focus:ring-2
                    focus:ring-blue-500/50
                  `}
                />
                <button
                  onClick={handleAddEmail}
                  disabled={!emailInput.trim()}
                  className={`
                    px-4 py-2
                    rounded-lg
                    ${emailInput.trim() ? theme.button.primary : 'opacity-50 cursor-not-allowed'}
                    text-white
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    hover:scale-[1.02]
                    active:scale-[0.98]
                    whitespace-nowrap
                  `}
                >
                  Add Email
                </button>
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="mb-4">
                  <div className={`${theme.text.secondary} text-xs font-medium mb-2 flex items-center gap-2`}>
                    <Users size={14} />
                    Selected ({selectedUsers.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <span
                        key={user.uid}
                        className={`
                          flex items-center gap-1.5
                          px-3 py-1.5
                          rounded-full
                          text-xs
                          ${theme.card.secondary}
                          ${theme.text.primary}
                          border
                          ${theme.table.divider}
                          transition-all
                          duration-200
                          group
                        `}
                      >
                        {user.isEmail ? (
                          <Mail size={12} className={theme.text.info} />
                        ) : (
                          <span className={`
                            w-5 h-5 rounded-full
                            bg-gradient-to-br
                            from-blue-500 to-blue-700
                            flex items-center justify-center
                            text-white text-[10px] font-semibold
                          `}>
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        )}
                        <span className="truncate max-w-32">
                          {user.isEmail ? user.email : user.name}
                        </span>
                        <button
                          onClick={() => handleRemoveUser(user.uid)}
                          className={`
                            ${theme.text.muted}
                            hover:${theme.text.danger}
                            transition-colors
                            duration-200
                            ml-0.5
                          `}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchQuery && searchResults.length > 0 && (
                <div className={`
                  ${theme.card.secondary}
                  rounded-lg
                  overflow-hidden
                  border
                  ${theme.table.divider}
                  max-h-48
                  overflow-y-auto
                `}>
                  {searchResults.map((user) => {
                    const isSelected = selectedUsers.some(u => u.uid === user.uid)
                    return (
                      <button
                        key={user.uid}
                        onClick={() => handleSelectUser(user)}
                        className={`
                          w-full flex items-center gap-3
                          px-4 py-2.5
                          transition-all
                          duration-200
                          hover:bg-gray-200/20
                          dark:hover:bg-gray-800/50
                          ${isSelected ? 'bg-blue-500/10' : ''}
                          group
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-full
                          bg-gradient-to-br
                          from-blue-500 to-purple-500
                          flex items-center justify-center
                          text-white text-xs font-semibold
                          flex-shrink-0
                        `}>
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className={`${theme.text.primary} text-sm font-medium truncate`}>
                            {user.name}
                          </p>
                          <p className={`${theme.text.muted} text-xs truncate`}>
                            {user.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <Check size={18} className={theme.text.success} />
                          ) : (
                            <UserPlus size={18} className={theme.text.muted} />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && (
                <div className={`
                  flex flex-col items-center justify-center
                  py-8
                  ${theme.text.muted}
                `}>
                  <Users size={32} className="opacity-20 mb-2" />
                  <p className="text-sm">No users found</p>
                  <p className="text-xs mt-1">Try a different search or add by email</p>
                </div>
              )}

              {/* Quick Stats */}
              {selectedUsers.length === 0 && !searchQuery && (
                <div className={`
                  flex flex-col items-center justify-center
                  py-8
                  ${theme.text.muted}
                `}>
                  <Users size={32} className="opacity-20 mb-2" />
                  <p className="text-sm">Search for users or enter emails</p>
                  <p className="text-xs mt-1">Select users to invite them to your team</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!inviteSent && (
          <div className={`
            flex items-center justify-end gap-3
            px-6 py-4
            ${theme.table.divider}
            border-t
            flex-shrink-0
          `}>
            <button
              onClick={onClose}
              className={`
                px-4 py-2
                rounded-lg
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                hover:${theme.text.primary}
              `}
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={selectedUsers.length === 0 || inviting}
              className={`
                flex items-center gap-2
                px-6 py-2.5
                rounded-lg
                text-white
                font-medium
                transition-all
                duration-200
                ${selectedUsers.length > 0 && !inviting
                  ? `${theme.button.primary} hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]`
                  : 'bg-blue-600/40 cursor-not-allowed opacity-60'
                }
              `}
            >
              {inviting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Invites ({selectedUsers.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InviteMembersModal