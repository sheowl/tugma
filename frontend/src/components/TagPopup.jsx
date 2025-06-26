import React from "react";
import { useTags } from "../context/TagsContext";

const TagPopup = ({ open, onClose, onTagSelect, onSave, currentTags = [] }) => {
  const { categories, tagMapping, categoryMapping, flatTagMapping } = useTags();
  const [selectedTags, setSelectedTags] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      // Initialize with current tags when popup opens
      setSelectedTags([...currentTags]);
    } else {
      setSelectedTags([]);
    }
  }, [open, currentTags]);

  const handleTagClick = (tag) => {
    let updated;
    if (selectedTags.includes(tag)) {
      updated = selectedTags.filter((t) => t !== tag);
    } else {
      updated = [...selectedTags, tag];
    }
    setSelectedTags(updated);
  };

  const handleCancel = () => {
    setSelectedTags([]);
    onClose();
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedTags);
    }
    onClose();
  };

  const hasChanges = () => {
    // Check if selected tags are different from current tags
    if (selectedTags.length !== currentTags.length) return true;
    return selectedTags.some(tag => !currentTags.includes(tag)) || 
           currentTags.some(tag => !selectedTags.includes(tag));
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 16px;
            margin-top: 16px;
            margin-bottom: 16px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #FF8032;
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: content-box;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #E66F24;
            background-clip: content-box;
          }
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: transparent;
          }
        `}</style>
        <button
          className="absolute top-8 left-8 text-3xl text-gray-400 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="bi bi-arrow-left text-[52px]" />
        </button>
        <h2 className="text-2xl font-bold text-[#FF8032] mb-6 mt-8 text-center">
          Select Tags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-8 mr-8">
          {Object.entries(categoryMapping).map(([categoryId, categoryName]) => {
            const categoryTags = tagMapping[categoryId] || {};
            
            return (
              <div key={categoryId}>
                <h3 className="text-lg font-semibold text-[#FF8032] mb-3">
                  {categoryName}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryTags).map(([tagId, tagName]) => (
                    <span
                      key={tagId}
                      className={`border border-[#FF8032] px-3 py-1 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                        selectedTags.includes(tagName)
                          ? "bg-[#FF8032] text-white"
                          : "bg-[#FFF6F0] text-[#FF8032] hover:bg-[#FFE0C2] hover:text-[#FF8032]"
                      }`}
                      onClick={() => handleTagClick(tagName)}
                    >
                      {selectedTags.includes(tagName) ? (
                        <>
                          <span className="font-bold">&times;</span> {tagName}
                        </>
                      ) : (
                        <>+ {tagName}</>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4 mt-8 mb-8 text-[14px]">
          <button
            onClick={handleCancel}
            className="w-[100px] h-[30px] px-4 py-0 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges()}
            className={`w-[110px] h-[30px] px-8 py-0 rounded-lg font-semibold transition-colors ${
              hasChanges()
                ? "bg-[#FF8032] text-white hover:bg-[#E66F24]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagPopup;