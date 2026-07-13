import React, {useEffect, useMemo, useState} from "react";
import {Button, Container, Input, Table} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {useDispatch, useSelector} from "react-redux";
import {fetchLanguageLines, getLanguageLine, refreshLanguageLines} from "../../../slices/languageLines/thunk";
import LanguageLinesCreate from "../../../Components/Custom/LanguageLines/LanguageLinesCreate";
import {closeLoading, showError, showLoading, showSuccess} from "../../../utils/swal";
import LanguageLineDelete from "../../../Components/Custom/LanguageLines/LanguageLineDelete";
import LanguageLineEdit from "../../../Components/Custom/LanguageLines/LanguageLineEdit";
import {RootState} from "../../../slices";
import PaginationButtons from "../../../Components/Common/PaginationButtons";
import {PER_PAGE} from "../../../constants";
import {withTranslation} from "react-i18next";
import {useCrudModals} from "../../../hooks/useCrudModals";
import FilterBar from "../../../Components/Custom/FilterBar";


const LanguageLines = (props: any) => {
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const dispatch = useDispatch<any>();
    const {items: languageLines, loading, count} = useSelector((state: RootState) => state.LanguageLines);

    const reload = () => dispatch(fetchLanguageLines({page, search}));

    const {showCreate, showEdit, showDelete} = useCrudModals(
        {create: LanguageLinesCreate, edit: LanguageLineEdit, remove: LanguageLineDelete},
        {onChange: reload}
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
            showLoading(props.t('updating'), `${props.t('loading')}...`);
            await dispatch(refreshLanguageLines());
            closeLoading();
        } catch (error) {
            closeLoading();
            await showError(props.t('error'), props.t('error_fetching_data', {type: 'language lines'}))
        }
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    useEffect(() => {
        dispatch(fetchLanguageLines({page, search}));
    }, [dispatch, page, search]);

    useEffect(() => {
        if (loading) {
            showLoading(props.t('loading'), props.t('wait'));
        } else {
            closeLoading()
        }
    }, [loading]);

    document.title = props.t('lang_page')
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={props.t('language')} pageTitle={props.t('main')}/>
                    <FilterBar
                        search={search}
                        onSearch={handleSearchChange}
                        onClear={() => {
                            setSearch('');
                            setPage(1);
                        }}
                        onCreate={showCreate}
                        createLabel={props.t('create', {item: props.t('lang_item')})}
                        actions={
                            <Button
                                className="btn btn-primary d-flex gap-1 align-items-center"
                                onClick={handleRefreshTranslations}
                                disabled={loading}
                            >
                                <FeatherIcon color="white" size={12} icon="refresh-cw"/>
                                {props.t('refresh')}
                            </Button>
                        }
                    />
                    <Table className='table table-striped table-nowrap table-bordered align-middle mb-0 text-center'>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{props.t('key')}</th>
                            <th>{props.t('eng')}</th>
                            <th>{props.t('ru')}</th>
                            <th>{props.t('uz')}</th>
                            <th>{props.t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {languageLines && languageLines.length > 0 ? languageLines.map((row: any, idx: string) => (
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
                <Container fluid>
                    {count > 10 ? (
                        <PaginationButtons
                            count={count}
                            currentPage={page}
                            perPageData={PER_PAGE}
                            setCurrentPage={(p) => {
                                setPage(p);
                                dispatch(fetchLanguageLines({page: p}));
                            }}
                        />
                    ) : null}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(LanguageLines);