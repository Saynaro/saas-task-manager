import './RecentActivity.css'

export function RecentActivity() {
    return (
        <div className="activity-container">
            <div className="activity-header">
                <h3>Recent Activity</h3>
                <button className="view-all-btn">⋮</button>
            </div>
            <div className="activity-body">
                <div className="activity-item">
                    <div className="activity-dot" style={{ background: '#005DA9' }}></div>
                    <div className="activity-line"></div>
                    <div className="activity-content">
                        <strong>Sarah Jenkins</strong> completed task <a className='activity-link' href="#">Update API documentation</a>
                        <div className="activity-time">2 hours ago</div>
                    </div>
                </div>

                <div className="activity-item">
                    <div className="activity-dot" style={{ background: '#D1D1D1' }}></div>
                    <div className="activity-line"></div>
                    <div className="activity-content">
                        <strong>Mike Ross</strong> commented on <a className='activity-link' href="#">Design Specs v2</a>
                        <div className="activity-quote">
                            "Looks good, but we need to verify the contrast ratios on the primary buttons."
                        </div>
                        <div className="activity-time">4 hours ago</div>
                    </div>
                </div>

                <div className="activity-item">
                    <div className="activity-dot" style={{ background: '#DDE2F1' }}></div>
                    <div className="activity-line"></div>
                    <div className="activity-content">
                        <strong>System</strong> deployed release <a className='activity-link' href="#">v1.4.2</a>
                        <div className="activity-time">Yesterday</div>
                    </div>
                </div>
            </div>
        </div>
    )

}