import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeProvider'
import InviteMembersModal from './InviteMembersModal'
import { UserPlus } from 'lucide-react'

const InviteMemberBtn = ({ users, projectId, onInvite }) => {

    const { theme } = useTheme()
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

    const handleInvite = (selectedUsers) => {
        if (onInvite) {
        onInvite(selectedUsers)
        }
        setIsInviteModalOpen(false)
    }

  return (
    <>
        <InviteMembersModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={handleInvite}
            existingUsers={users}
            projectId={projectId}
        />

        <button
            onClick={() => setIsInviteModalOpen(true)}
            className={`
            mt-4
            px-4 py-2
            rounded-lg
            ${theme.button.primary}
            text-white
            text-sm
            transition-all
            duration-200
            hover:scale-[1.02]
            hover:shadow-lg
            hover:shadow-blue-500/25
            active:scale-[0.98]
            `}>
            <UserPlus size={16} className="inline mr-2" />
            Invite Members
        </button>
    </>
  )
}

export default InviteMemberBtn
