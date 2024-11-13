import React from 'react';
import './DashboardWidget.css';

function DashboardWidget({ title, content }) {
  return (
    <div className="dashboard-widget">
      <p>{title}</p>
      <div className="widget-content">
        {content}
      </div>
    </div>
  );
}

export default DashboardWidget;
