import React, {Component} from 'react';
import ReactSummernote from 'react-summernote';
import {} from 'react-bootstrap'
import 'bootstrap' // ibid.
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-ru-RU'; // you can import any other locale
import 'bootstrap/dist/css/bootstrap.css';

class RichTextEditor extends Component {
    constructor(props) {
        super(props);

        this.contents = props.contents
        this.setContents = props.setContents
    }

    onChange(content, $editable) {
        // props.setContents(content)
        // this.setContents(content)
    }

    onInit = (note) => {
        note.reset()
        note.replace(this.props.contents)
        this.setContents(note.summernote('code'))
        // note.summernote('pasteHTML', this.contents);
    }

    onFocus = () => {
        this.setContents(this.wysiwygEditorRef.editor.summernote('code'))
    }

    onEnter = () => {
        this.setContents(this.wysiwygEditorRef.editor.summernote('code'))
    }

    onChangeCodeView = (content) => {
        document.addEventListener("keydown", function(event)
        {
            alert('hello')
            event.currentTarget.innerHTML = content
        });
    }

    onImageUpload = (images, insertImage) => {
        for (let i = 0; i < images.length; i++) {
            let reader = new FileReader();
            reader.readAsDataURL(images[i])

            reader.onloadend = () => {
                const base64 = reader.result
                ReactSummernote.insertImage(base64);
            }
        }
    };

    render() {
        return (
            <ReactSummernote
                value="Default value"
                options={{
                    lang: 'ko-KR',
                    height: 350,
                    dialogsInBody: true,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', ['fullscreen', 'codeview']]
                    ]
                }}
                onChange={this.onChange}
                onInit={this.onInit}
                onFocus={this.onFocus}
                onEnter={this.onEnter}
                onImageUpload={this.onImageUpload}
                onChangeCodeview={this.onChangeCodeView}
                ref={el => this.wysiwygEditorRef = el}
            />
        );
    }
}

export default RichTextEditor;