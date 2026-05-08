import { Layout } from "../components/Layout"
import "./ActivityPage.css"

export function ActivityPage({ currentUser }) {
    return (
        <Layout currentUser={currentUser}>
            <div className="activity-page-content">
                <h1>Activity Page</h1>
                <p>Activity Page</p>
            </div>
        </Layout>
    )
}