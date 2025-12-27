import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    return (
        <div className="rich-text-editor">
            <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                preview="edit"
                height={300}
                visibleDragbar={false}
                textareaProps={{
                    placeholder: placeholder || 'Write your message here...'
                }}
            />
            <style>{`
        .rich-text-editor {
          margin: 16px 0;
        }
        
        .rich-text-editor .w-md-editor {
          border-radius: 8px;
          border: 1px solid #d1d5db;
        }
        
        .rich-text-editor .w-md-editor-toolbar {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .rich-text-editor .w-md-editor-content {
          background: white;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
