import React from 'react';
import { Download, FileText, Archive, Image, File } from 'lucide-react';
import { Attachment } from '../../types';

interface AttachmentListProps {
  attachments: Attachment[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ attachments }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'zip':
        return Archive;
      case 'image':
        return Image;
      default:
        return File;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'text-red-400';
      case 'zip':
        return 'text-yellow-400';
      case 'image':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  if (attachments.length === 0) return null;

  return (
    <div className="glass-card p-6 mt-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Download size={20} className="mr-2" />
        Downloads & Attachments
      </h3>
      <div className="space-y-3">
        {attachments.map((attachment) => {
          const Icon = getIcon(attachment.type);
          const iconColor = getIconColor(attachment.type);
          
          return (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <Icon size={24} className={iconColor} />
                <div>
                  <p className="text-white font-medium group-hover:text-blue-200 transition-colors">
                    {attachment.name}
                  </p>
                  <p className="text-white/60 text-sm">{attachment.size}</p>
                </div>
              </div>
              <button className="glass-button py-2 px-4 text-sm">
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttachmentList;