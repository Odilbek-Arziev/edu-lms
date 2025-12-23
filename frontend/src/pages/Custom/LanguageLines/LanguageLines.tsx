import React, {useEffect, useMemo, useState} from "react";
import {Button, Container, Input, Table} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {useDispatch, useSelector} from "react-redux";
import {fetchLanguageLines, getLanguageLine, refreshLanguageLines} from "../../../slices/languageLines/thunk";
import {useModal} from "../../../Components/Hooks/useModal";
import LanguageLinesCreate from "../../../Components/Custom/LanguageLines/LanguageLinesCreate";
import {closeLoading, showError, showLoading, showSuccess} from "../../../utils/swal";
import LanguageLineDelete from "../../../Components/Custom/LanguageLines/LanguageLineDelete";
import LanguageLineEdit from "../../../Components/Custom/LanguageLines/LanguageLineEdit";
import {RootState} from "../../../slices";

type EditModalProps = {
    id: number;
    initialValues: any;
};

const LanguageLines = () => {
    const [search, setSearch] = useState<string>('');
    const dispatch = useDispatch<any>();
    const {items: languageLines, loading} = useSelector((state: RootState) => state.LanguageLines);

    const [showCreate, hideCreate] = useModal(
        <LanguageLinesCreate onSuccess={() => {
            dispatch(fetchLanguageLines())
            hideCreate()
        }} onCancel={() => hideCreate()}/>,
    )

    const [showDelete, hideDelete] = useModal<{ id: number }>(
        (props: { id: number }) => (
            <LanguageLineDelete
                {...props}
                onSuccess={() => {
                    dispatch(fetchLanguageLines());
                    hideDelete();
                }}
                onCancel={() => hideDelete()}
            />
        )
    );

    const [showEdit, hideEdit] = useModal<EditModalProps>(
        (props: EditModalProps) => (
            <LanguageLineEdit
                {...props}
                onSuccess={() => {
                    dispatch(fetchLanguageLines());
                    hideEdit();
                }}
                onCancel={() => hideEdit()}
            />
        )
    );

    async function getData(id: number) {
        const response = await dispatch(getLanguageLine(id));
        if (response) {
            showEdit({
                id: id,
                initialValues: response
            });
        }
    }

    const handleRefreshTranslations = async () => {
        try {
            showLoading('Обновление переводов', 'Загружаем последние переводы...');
            await dispatch(refreshLanguageLines());
            closeLoading();
        } catch (error) {
            closeLoading();
            await showError('Ошибка', 'Не удалось обновить переводы')
        }
    };

    useEffect(() => {
        dispatch(fetchLanguageLines());
    }, [dispatch])

    useEffect(() => {
        if (loading) {
            showLoading('Загрузка', 'Пожалуйста, подождите...');
        } else {
            closeLoading()
        }
    }, [loading]);

    const tableData = useMemo(() => {
        let items = languageLines;

        if (search) {
            const searchLower = search.toLowerCase();
            items = items.filter((item: any) =>
                item.key?.toLowerCase().includes(searchLower) ||
                item.value.en?.toLowerCase().includes(searchLower) ||
                item.value.ru?.toLowerCase().includes(searchLower) ||
                item.value.uz?.toLowerCase().includes(searchLower)
            );
        }
        return items;

    }, [search, languageLines]);

    document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Language" pageTitle="Dashboards"/>
                    <div className="d-flex justify-content-between my-2">
                        <div className='d-flex gap-1'>
                            <div className="search-box">
                                <Input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <i className="ri-search-line search-icon"/>
                            </div>

                            <Button className='btn btn-secondary d-flex gap-1 align-items-center'
                                    onClick={() => setSearch('')}>
                                <FeatherIcon color="white" size={12} icon="trash"/>
                                Clear
                            </Button>
                        </div>
                        <div className='d-flex gap-1'>
                            <Button className='btn btn-success d-flex gap-1 align-items-center' onClick={showCreate}>
                                <FeatherIcon color="white" size={12} icon="plus-circle"/>
                                Create
                            </Button>
                            <Button
                                className='btn btn-primary d-flex gap-1 align-items-center'
                                onClick={handleRefreshTranslations}
                                disabled={loading}
                            >
                                <FeatherIcon color="white" size={12} icon="refresh-cw"/>
                                Refresh
                            </Button>
                        </div>
                    </div>
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Key</th>
                            <th>English</th>
                            <th>Russian</th>
                            <th>Uzbek</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData && tableData.length > 0 ? tableData.map((row: any, idx: string) => (
                            <tr key={row.id || idx}>
                                <td>{idx + 1}</td>
                                <td>{row.key}</td>
                                <td>{row.value.en ?? '-'}</td>
                                <td>{row.value.ru ?? '-'}</td>
                                <td>{row.value.uz ?? '-'}</td>
                                <td className='d-flex gap-1 justify-content-center'>
                                    <Button className='btn btn-info btn-sm' onClick={() => getData(row.id)}>
                                        <FeatherIcon color="white" size={12} icon="edit"/>
                                    </Button>
                                    <Button className='btn btn-danger btn-sm'
                                            onClick={() => showDelete({id: row.id})}>
                                        <FeatherIcon color="white" size={12} icon="trash"/>
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center">No data found</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default LanguageLines;