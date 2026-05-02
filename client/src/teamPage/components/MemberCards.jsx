import './MemberCards.css'
import { Mail } from 'lucide-react'

export function MemberCards({ members }) {
    
    // We will add a few dummy members just so the grid looks full and beautiful 
    // strictly for demonstration, while keeping the interactive user from data.js
    const demoMembers = [
        ...members,
        { id: 'd1', firstName: 'Emma', lastName: 'Rose', email: 'emma@timetoprogram.com', pending: 2, inProgress: 2, completed: 1 },
        { id: 'd2', firstName: 'James', lastName: 'Dean', email: 'james@timetoprogram.com', pending: 3, inProgress: 1, completed: 1 },
        { id: 'd3', firstName: 'Luke', lastName: 'Ryan', email: 'luke@timetoprogram.com', pending: 4, inProgress: 0, completed: 0 },
        { id: 'd4', firstName: 'Anna', lastName: 'Grace', email: 'anna@timetoprogram.com', pending: 3, inProgress: 0, completed: 0 },
        { id: 'd5', firstName: 'Mark', lastName: 'Lee', email: 'mark@timetoprogram.com', pending: 2, inProgress: 2, completed: 0 },
    ];

    return (
        <div className="members-grid">
            {demoMembers.map((member) => (
                <div className="member-card-min" key={member.id}>
                    <div className="member-card-header">
                        <img 
                            src={`https://i.pravatar.cc/150?u=${member.id}`} 
                            alt={`${member.firstName} avatar`} 
                            className="member-avatar-min" 
                        />
                        <div className="member-info-min">
                            <h3 className="member-name-min">{member.firstName} {member.lastName}</h3>
                            <div className="member-email-min">
                                <Mail size={12} /> {member.email}
                            </div>
                        </div>
                    </div>

                    <div className="member-stats-min">
                        <div className="stat-box-min pending-stat">
                            <div className="stat-value">{member.pending}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                        <div className="stat-box-min active-stat">
                            <div className="stat-value">{member.inProgress}</div>
                            <div className="stat-label">In Progress</div>
                        </div>
                        <div className="stat-box-min done-stat">
                            <div className="stat-value">{member.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
