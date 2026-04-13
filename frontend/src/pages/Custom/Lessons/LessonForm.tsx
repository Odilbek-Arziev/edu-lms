import React, {useEffect, useRef} from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback,
    Card,
    CardBody
} from 'reactstrap';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';

import {lessonsThunks} from "../../../slices/lessons";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const LessonForm = (props: any) => {
    const {moduleId, lessonId} = useParams<{ moduleId?: string, lessonId?: string }>();
    const isEditMode = !!lessonId

    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    const ejInstance = useRef<EditorJS | null>(null);
    const editorReady = useRef(false);

    const validationSchema = Yup.object({
        title: Yup.string().required(props.t('field_required')),
        duration: Yup.number().min(1, props.t('min_duration')).nullable(),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            duration: null as number | null,
            short_description: '',
            is_preview: false
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const savedData = await ejInstance.current?.save();
                const content = JSON.stringify(savedData);

                if (isEditMode) {
                    if (isEditMode) {
                        await dispatch(lessonsThunks.update(Number(lessonId), {
                            title: values.title,
                            duration: values.duration,
                            short_description: values.short_description,
                            content,
                            is_preview: values.is_preview,
                        }));
                    }
                } else {
                    await dispatch(lessonsThunks.create({
                        module: Number(moduleId),
                        title: values.title,
                        duration: values.duration,
                        short_description: values.short_description,
                        content,
                        is_preview: values.is_preview
                    }))
                }
                navigate(-1)
            } catch (error) {
                console.log(props.t('error_saving_data'))
            }
        }
    })

    const initEditor = (data?: any) => {
        if (!ejInstance.current) {
            ejInstance.current = new EditorJS({
                holder: 'editorjs-holder',
                tools: {
                    header: {
                        class: Header,
                        config: {
                            levels: [1, 2, 3, 4],
                            defaultLevel: 2
                        }
                    },
                    list: List,
                    quote: Quote,
                    code: CodeTool,
                    inlineCode: InlineCode,
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {byFile: `${import.meta.env.VITE_APP_HOST_API_URL}/api/upload-image/`}
                        }
                    }
                },
                placeholder: props.t('start_writing_your_lesson'),
                data: data || {blocks: []},
                minHeight: 0,
                defaultBlock: 'paragraph',
                onReady: () => {
                    editorReady.current = true;
                }
            });
        }
    };

    useEffect(() => {
        const loadLesson = async () => {
            if (isEditMode) {
                const lesson = await dispatch(lessonsThunks.getById(Number(lessonId)))

                if (lesson) {
                    formik.setValues({
                        title: lesson.title || '',
                        duration: lesson.duration || null,
                        short_description: lesson.short_description || '',
                        is_preview: lesson.is_preview || false
                    })
                    const contentData = lesson.content ? JSON.parse(lesson.content) : {blocks: []}
                    initEditor(contentData)
                }
            } else {
                initEditor()
            }
        }

        loadLesson()

        const style = document.createElement('style');
        style.textContent = `
            .codex-editor .ce-block__content,
            .codex-editor .ce-toolbar__content {
                max-width: none !important;
                margin-left: 50px !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (ejInstance.current) {
                ejInstance.current.isReady
                    .then(() => {
                        ejInstance.current?.destroy();
                        ejInstance.current = null;
                    })
                    .catch(() => {
                        ejInstance.current = null;
                    });
            }
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="page-content" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
            <Container fluid>
                <BreadCrumb
                    title={props.t(isEditMode ? 'edit_lesson' : 'create_lesson')}
                    pageTitle={props.t('Lessons')}
                />

                <Form onSubmit={formik.handleSubmit} className="mt-4">
                    <Row>
                        <Col xs={12}>

                            <Card className="border-0 shadow-sm mb-4">
                                <CardBody className="p-4 p-md-5">

                                    <FormGroup className="mb-5">
                                        <Input
                                            name="title"
                                            type="text"
                                            className="form-control-lg border-0 fs-1 fw-bold px-0 shadow-none text-dark"
                                            placeholder={props.t('lesson_title_placeholder')}
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            invalid={!!(formik.touched.title && formik.errors.title)}
                                            style={{
                                                fontSize: '2.25rem',
                                                backgroundColor: 'transparent',
                                                lineHeight: '1.3'
                                            }}
                                        />
                                        {formik.touched.title && formik.errors.title && (
                                            <FormFeedback className="d-block mt-2">
                                                {formik.errors.title}
                                            </FormFeedback>
                                        )}
                                    </FormGroup>

                                    <Row className="g-4 mb-5 pb-4 border-bottom">
                                        <Col md={4}>
                                            <Label
                                                className="text-muted small fw-semibold text-uppercase d-flex align-items-center mb-3">
                                                <FeatherIcon icon="clock" size={16} className="me-2 text-primary"/>
                                                {props.t('enter_duration')}
                                            </Label>
                                            <Input
                                                type="number"
                                                name="duration"
                                                className="form-control border shadow-none"
                                                placeholder={props.t('enter_minutes')}
                                                value={formik.values.duration || ''}
                                                onChange={formik.handleChange}
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderColor: '#e9ecef !important'
                                                }}
                                            />
                                        </Col>

                                        <Col md={8}>
                                            <Label
                                                className="text-muted small fw-semibold text-uppercase d-flex align-items-center mb-3">
                                                <FeatherIcon icon="align-left" size={16} className="me-2 text-primary"/>
                                                {props.t('short_short_description')}
                                            </Label>
                                            <Input
                                                type="text"
                                                name="short_description"
                                                className="form-control border shadow-none"
                                                placeholder={props.t('brief_summary')}
                                                value={formik.values.short_description}
                                                onChange={formik.handleChange}
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderColor: '#e9ecef !important'
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mb-5 pb-4 border-bottom">
                                        <Col>
                                            <FormGroup check className="mb-0">
                                                <Input
                                                    type="checkbox"
                                                    name="is_preview"
                                                    id="is_preview"
                                                    checked={formik.values.is_preview}
                                                    onChange={formik.handleChange}
                                                    className="form-check-input"
                                                />
                                                <Label check htmlFor="is_preview" className="form-check-label ms-2">
                                                    <div className="d-flex align-items-center">
                                                        <FeatherIcon icon="eye" size={16} className="me-2 text-info"/>
                                                        <div>
                                                            <div className="fw-medium">{props.t('preview_lesson')}</div>
                                                            <small className="text-muted">
                                                                {props.t('preview_lesson_description')}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <div className="mb-4">
                                        <Label
                                            className="text-muted small fw-semibold text-uppercase d-flex align-items-center mb-3">
                                            <FeatherIcon icon="edit-3" size={16} className="me-2 text-primary"/>
                                            {props.t('lesson_content')}
                                        </Label>
                                        <div
                                            className="modern-editor-wrapper rounded w-100"
                                            style={{
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e9ecef',
                                                minHeight: '500px'
                                            }}
                                        >
                                            <div id="editorjs-holder" style={{width: '100%'}}/>
                                        </div>
                                    </div>

                                </CardBody>
                            </Card>

                            <Card className="border-0 shadow-sm sticky-bottom">
                                <CardBody className="p-4">
                                    <div className="d-flex justify-content-end align-items-center">
                                        <div className="d-flex gap-3">
                                            <Button
                                                color="light"
                                                size="sm"
                                                className="px-4 "
                                                onClick={() => navigate(-1)}
                                            >
                                                {props.t('cancel')}
                                            </Button>
                                            <Button
                                                color="success"
                                                type="submit"
                                                size="sm"
                                                className="px-5"
                                                disabled={formik.isSubmitting}
                                            >
                                                <FeatherIcon icon="check" size={18} className="me-2"/>
                                                {formik.isSubmitting
                                                    ? props.t('saving')
                                                    : props.t(isEditMode ? 'save' : 'publish_lesson')
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
};

export default withTranslation()(LessonForm);
