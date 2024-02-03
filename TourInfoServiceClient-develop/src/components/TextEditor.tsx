import {useState, FC, Ref, useRef, forwardRef, useImperativeHandle} from 'react'
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {imageUpload} from '../api/Board/board'
import {ImageReturnData} from '../data/Board/BoardData'

type TextEditorProps = {
    initialValue?: string
    width?: string
    height?: string
    ref?: Ref<EditorRef>
}

export type EditorRef = {
    getImages: ImageReturnData[] | null
    getEditor: () => CKEditor<ClassicEditor> | null
}

export const TextEditor: FC<TextEditorProps> = forwardRef<EditorRef, TextEditorProps>(
    ({initialValue}, ref) => {
        const [flag, setFlag] = useState(false)
        const ckRef = useRef<CKEditor<ClassicEditor> | null>(null)
        const [images, setImages] = useState<ImageReturnData[]>([])

        useImperativeHandle(ref, () => ({
            getImages: images,
            getEditor: () => ckRef.current
        }))

        const customUploadAdapter = (loader: any) => {
            // (2)
            return {
                upload() {
                    return new Promise((resolve, reject) => {
                        const data = new FormData()
                        loader.file.then((file: File) => {
                            data.append('name', file.name)
                            data.append('file', file)

                            imageUpload(file)
                                .then(res => {
                                    setImages([...images, res])
                                    console.log(images)
                                    resolve({
                                        default: `${res.src}`
                                    })
                                })
                                .catch(err => reject(err))
                        })
                    })
                }
            }
        }

        function uploadPlugin(editor: any) {
            // (3)
            editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                return customUploadAdapter(loader)
            }
        }

        return (
            <CKEditor
                editor={CustomEditor}
                config={{
                    ckfinder: {
                        uploadUrl: 'http://localhost:8080/image'
                    },
                    placeholder: initialValue || '내용을 입력하세요',
                    extraPlugins: [uploadPlugin]
                    // extraPlugins: [CKFinder]
                }}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor)
                }}
                onChange={(event, editor) => {
                    const data = editor.getData()
                    console.log({images})
                    console.log({event, editor, data})
                }}
                // onBlur={(event, editor) => {
                //     console.log('Blur.', editor)
                // }}
                // onFocus={(event, editor) => {
                //     console.log('Focus.', editor)
                // }}
                onError={(error, {willEditorRestart}) => {
                    console.log('Error.')
                }}
                ref={ckRef}
            />
        )
    }
)

type TextBoxProps = {
    data: string
    id?: string
}
// show content
export const TextBox: FC<TextBoxProps> = props => {
    return (
        <CKEditor
            id={props.id}
            editor={CustomEditor}
            disabled={true}
            data={props.data}
            config={{
                toolbar: []
            }}
        />
    )
}
