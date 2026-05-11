import './MemberCards.css'
import { Mail } from 'lucide-react'

export function MemberCards({ members, currentUserId }) {
    return (
        <div className="members-grid">
            {members.map((member) => (
                <div className={`member-card-min ${member.id === currentUserId ? 'is-me' : ''}`} key={member.id}>
                    <div className="member-card-header">
                        <img
                            src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName || 'User')}&background=random`}
                            alt={`${member.fullName} avatar`}
                            className="member-avatar-min"
                        />
                        <div className="member-info-min">
                            <h3 className="member-name-min">
                                {member.fullName || `${member.firstName} ${member.lastName}`}
                                {member.id === currentUserId && <span className="you-label">YOU</span>}
                                {member.role === 'OWNER' && member.id !== currentUserId && <span className="owner-label-text">OWNER</span>}
                            </h3>
                            <div className="member-email-min">
                                <Mail size={12} /> {member.email}
                            </div>
                        </div>
                    </div>

                    <div className="member-stats-min">
                        <div className="stat-box-min pending-stat">
                            <div className="stat-value">{member.pending || 0}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                        <div className="stat-box-min active-stat">
                            <div className="stat-value">{member.inProgress || 0}</div>
                            <div className="stat-label">In Progress</div>
                        </div>
                        <div className="stat-box-min done-stat">
                            <div className="stat-value">{member.completed || 0}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            ))}
            {members.length === 0 && <div className="no-members-msg">No members found in this workspace.</div>}
        </div>
    )
}
