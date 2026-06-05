import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SearchInput from "../../../Components/Common/SearchInput";
import {withTranslation} from "react-i18next";
import {useFetchData} from "../../../hooks/useFetchData";
import {closeLoading, showLoading} from "../../../utils/swal";
import {useModal} from "../../../Components/Hooks/useModal";
import {EditModalProps} from "../../../types/editModal";
import {useDispatch} from "react-redux";
import {materialsThunk} from "../../../slices/materials/reducer";
import MaterialCreate from "../../../Components/Custom/Materials/MaterialCreate";
import MaterialEdit from "../../../Components/Custom/Materials/MaterialEdit";
import MaterialDelete from "../../../Components/Custom/Materials/MaterialDelete";

const Materials = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch<any>();

    const {localData: materials, isSearching, fetchData} = useFetchData(
        materialsThunk.fetch,
        'materials',
        () => ({
            ...(search && {search}),
        })
    );

    const [showCreate, hideCreate] = useModal(
        <MaterialCreate onSuccess={() => {
            fetchData();
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <MaterialEdit
                {...props}
                onSuccess={() => {
                    fetchData();
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <MaterialDelete
                {...props}
                onSuccess={() => {
                    fetchData();
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    async function getData(id: number) {
        const response = await dispatch(materialsThunk.getById(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: {
                    title: response.title,
                    description: response.description,
                    lesson_id: response.lesson.id,
                    url: response.url,
                    file: response.file,

                }
            });
        }
    }

    useEffect(() => {
        fetchData();
    }, [search]);

    useEffect(() => {
        if (isSearching) {
            showLoading(props.t('loading'), props.t('wait'));
        } else {
            closeLoading();
        }
    }, [isSearching]);

    document.title = props.t('materials_page');

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('materials')} pageTitle={props.t('main')}/>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <SearchInput
                                value={search}
                                onSearch={setSearch}
                            />
                            <Button className='btn btn-secondary d-flex gap-1 align-items-center'
                                    onClick={() => setSearch('')}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                {props.t('clear')}
                            </Button>
                        </div>
                        <Button className='btn btn-success d-flex gap-1 align-items-center'
                            onClick={showCreate}
                        >
                            <FeatherIcon color="white" size={12} icon="plus-circle"/>
                            {props.t('create', {item: props.t('category')})}
                        </Button>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('title')}</th>
                            <th>{props.t('lesson')}</th>
                            <th>{props.t('url')}</th>
                            <th>{props.t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {materials?.map((row: any, idx: number) => (
                            <tr key={row.id}>
                                <td>{idx + 1}</td>
                                <td>{row.title}</td>
                                <td>{row.lesson.title}</td>
                                <td>
                                    {
                                        row.url ? (
                                            <a
                                                className="btn btn-primary btn-sm"
                                                href={row.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Открыть
                                            </a>
                                        ) : (
                                            <a
                                                className="btn btn-success btn-sm"
                                                href={row.file}
                                                target="_blank"
                                                download
                                            >
                                                Скачать
                                            </a>
                                        )
                                    }
                                </td>
                                <td className='d-flex gap-1 justify-content-center'>
                                    <Button className='btn btn-info btn-sm'
                                        onClick={() => getData(row.id)}
                                    >
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm'
                                        onClick={() => showDelete({id: row.id})}
                                    >
                                        <FeatherIcon color="white" size={12} icon="trash"/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Materials);