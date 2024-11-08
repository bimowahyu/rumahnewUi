import React from 'react';
import './DashboardWidget.css';

function DashboardWidget({ title, content }) {
  return (
    <div className="dashboard-widget">
      <h3>{title}</h3>
      <div className="widget-content">
        {content}
      </div>
    </div>
  );
}

export default DashboardWidget;
