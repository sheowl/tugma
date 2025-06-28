export default function ApplicantNotification({ open, onClose, notification = [], onViewDetails }) {
  if (!open) return null;

  const statusStyles = {
  Accepted: {
    icon: "bi-check-lg",
    color: "text-[#27AE60]",
    badgeBg: "bg-[#E5FEF0]",
  },
  Rejected: {
    icon: "bi-x-lg",
    color: "text-[#E74C3C]",
    badgeBg: "bg-[#FFECEA]",
  },
  Waitlisted: {
    icon: "bi-clock",
    color: "text-[#F5B041]",
    badgeBg: "bg-[#FFF9F0]",
  },
};

  return (
    <div className="w-[416px] max-h-[604px] overflow-y-auto p-6 bg-white shadow-lg rounded-[10px] font-montserrat border">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h5 className="font-semibold text-xl mb-2">Notifications</h5>
        <button onClick={onClose} className="btn-close" aria-label="Close"></button>
      </div>

      {/* Notification List */}
      <div className="mt-6 flex flex-col gap-4">
        {notification.length > 0 ? (
          notification.map((notif, index) => {
            const style = statusStyles[notif.status] || {};
            return (
              <div
                key={index}
                className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => onViewDetails?.(notif)}
              >
                {/* Left: Icon + Info */}
                <div className="flex gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${style.badgeBg}`}>
                    <i className={`bi ${style.icon} text-base ${style.color}`}></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{notif.title}</div>
                    <div className="text-sm text-gray-500 mb-1">{notif.company}</div>
                    <span className={`mt-2 px-3 py-1 text-xs font-medium rounded-full ${style.badgeBg} ${style.color}`}>
                      {notif.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 whitespace-nowrap mt-1">
                  {notif.timeAgo}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-sm text-gray-500 py-10">
            No notifications today.
          </div>
        )}
      </div>

    </div>
  );
}