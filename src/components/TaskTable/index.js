import React, { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  TableSortLabel,
  TablePagination,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  Button,
  useTheme,
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { StockOutlined, FallOutlined, RiseOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import CustomDialog from '../Dialog';
import AlertSnackBar from 'components/SnackBar';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask } from 'store/reducers/tasks';
import moment from 'moment';

/** Start of Status and Priority chip */

const iconSX = { color: 'inherit' };
const dropSX = {
  minWidth: '150px'
};

export const getStatus = (status) => {
  const config = ((chipStatus) => {
    switch (chipStatus) {
      case 'todo':
        return { color: 'warning', value: 'Todo' };
      case 'inprogress':
        return { color: 'primary', value: 'In-Progress' };
      case 'completed':
        return { color: 'success', value: 'Completed' };
      default:
        return { color: 'error', value: 'Cancelled' };
    }
  })(status);

  return (
    <Grid item>
      <Chip variant="light" color={config.color} label={config.value} sx={{ ml: 1.25, minWidth: '100px' }} size="sizeLarge" />
    </Grid>
  );
};

export const getPriority = (priority) => {
  const config = ((chipPriority) => {
    switch (chipPriority) {
      case 'low':
        return { color: 'primary', value: 'Low', icon: FallOutlined };
      case 'medium':
        return { color: 'warning', value: 'Medium', icon: StockOutlined };
      default:
        return { color: 'error', value: 'High', icon: RiseOutlined };
    }
  })(priority);

  return (
    <Grid item>
      <Chip
        icon={<config.icon style={iconSX} />}
        variant="light"
        color={config.color}
        label={config.value}
        sx={{ ml: 1.25, minWidth: '100px' }}
        size="sizeLarge"
      />
    </Grid>
  );
};

/** End of status and priority chip */

/** Start of table sorting functions */
const descendingComparator = (a, b, orderBy) => {
  if (orderBy === 'taskId') {
    var a_id = parseInt(a[orderBy].split('-')[1]);
    var b_id = parseInt(b[orderBy].split('-')[1]);
    if (b_id < a_id) {
      return -1;
    }
    if (b_id > a_id) {
      return 1;
    }
  } else if (orderBy === 'status') {
    let sortOrder = {
      todo: 0,
      inprogress: 1,
      completed: 2,
      cancelled: 3
    };

    if (sortOrder[b[orderBy]] < sortOrder[a[orderBy]]) {
      return -1;
    }
    if (sortOrder[b[orderBy]] > sortOrder[a[orderBy]]) {
      return 1;
    }
  } else if (orderBy === 'priority') {
    let sortOrder = {
      low: 0,
      medium: 1,
      high: 2
    };
    if (sortOrder[b[orderBy]] < sortOrder[a[orderBy]]) {
      return -1;
    }
    if (sortOrder[b[orderBy]] > sortOrder[a[orderBy]]) {
      return 1;
    }
  } else if (orderBy === 'endDate' || orderBy === 'startDate') {
    var dateA = moment(a[orderBy], 'DD/MM/YYYY').toDate();
    var dateB = moment(b[orderBy], 'DD/MM/YYYY').toDate();
    if (dateB < dateA) {
      return -1;
    }
    if (dateB > dateA) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }

  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  {
    id: 'taskId',
    align: 'center',
    disablePadding: true,
    label: 'Task ID'
  },
  {
    id: 'title',
    align: 'center',
    disablePadding: true,
    label: 'Summary'
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: 'Status'
  },
  {
    id: 'priority',
    align: 'center',
    disablePadding: true,
    label: 'Priority'
  },
  {
    id: 'startDate',
    align: 'center',
    disablePadding: true,
    label: 'Created Date'
  },
  {
    id: 'endDate',
    align: 'center',
    disablePadding: true,
    label: 'Due Date'
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: true,
    label: 'Actions'
  }
];

const TaskTableHeader = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
/** End of taable sorting functions */

const InprogressTable = ({ isPendingPage = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks: rows } = useSelector((state) => state.tasks);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('taskId');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [snackBar, setSnackBar] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    description: 'Are you sure want to delete this record. Once deleted we cannot retrive back',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    customValue: ''
  });

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleClearFilter = () => {
    setPriority('');
    setSearch('');
    if (isPendingPage) {
      setStatus('inprogress');
    } else {
      setStatus('');
    }
  };

  const handleEditTask = (taskId) => {
    navigate('/edit', { state: { taskId: taskId } });
  };

  const handleSnackbar = () => {
    setSnackBar((prev) => !prev);
  };

  const handleCancel = () => {
    setDialog((prev) => {
      return {
        ...prev,
        open: false,
        title: '',
        customValue: ''
      };
    });
  };

  const handleConfirm = (id) => {
    dispatch(deleteTask({ taskId: id }));
    handleCancel();
    handleSnackbar();
  };

  const handleDeleteTask = (taskId) => {
    setDialog((prev) => {
      return { ...prev, open: true, title: `Delete task - ${taskId}?`, customValue: taskId };
    });
  };

  let filterTableRow = rows.filter(
    (o) =>
      (o.priority === priority || priority === '') &&
      (o.status === status || status === '') &&
      o.title.toLowerCase().includes(search.toLowerCase())
  );

  const tableRowData = stableSort(filterTableRow, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    if (isPendingPage) {
      setStatus('inprogress');
    }
  }, [isPendingPage]);

  return (
    <>
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3} md={2} lg={3}>
            <Select sx={dropSX} id="select-priority" displayEmpty value={priority} onChange={handlePriorityChange} fullWidth>
              <MenuItem value={''}>Priority</MenuItem>
              <MenuItem value={'low'}>Low</MenuItem>
              <MenuItem value={'medium'}>Medium</MenuItem>
              <MenuItem value={'high'}>High</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} sm={3} md={2} lg={3}>
            <Select
              sx={dropSX}
              id="select-status"
              displayEmpty
              value={status}
              onChange={handleStatusChange}
              fullWidth
              disabled={isPendingPage}
            >
              <MenuItem value={''}>Status</MenuItem>
              <MenuItem value={'todo'}>Todo</MenuItem>
              <MenuItem value={'inprogress'}>In-Progress</MenuItem>
              <MenuItem value={'completed'}>Completed</MenuItem>
              <MenuItem value={'cancelled'}>Cancelled</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={3} md={3} lg={4}>
            <OutlinedInput
              id="search"
              type="text"
              value={search}
              name="search"
              onChange={handleSearchChange}
              placeholder="Search"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="medium">
                    <CloseOutlined />
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3} lg={2}>
            <Button
              fullWidth
              onClick={handleClearFilter}
              endIcon={
                <CloseOutlined
                  style={{
                    fontSize: '1em'
                  }}
                  size="medium"
                />
              }
              variant="outlined"
              color="error"
            >
              Clear Filter
            </Button>
          </Grid>
        </Grid>
        <Box>
          <TableContainer
            sx={{
              width: '100%',
              overflowX: 'auto',
              position: 'relative',
              display: 'block',
              maxWidth: '100%',
              th: { whiteSpace: 'nowrap' }
            }}
          >
            <Table aria-labelledby="tableTitle">
              <TaskTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
              <TableBody>
                {tableRowData.length > 0 ? (
                  tableRowData.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        tabIndex={-1}
                        key={row.taskId}
                      >
                        <TableCell align="center" id={labelId} width="12%">
                          <Link
                            style={{ cursor: 'pointer', color: theme.palette.primary.main }}
                            to={`/view`}
                            state={{ taskId: row.taskId }}
                          >
                            {row.taskId}
                          </Link>
                        </TableCell>
                        <TableCell align="left" width="40%">
                          <Link style={{ cursor: 'pointer', color: theme.palette.primary.main }} to="/view" state={{ taskId: row.taskId }}>
                            {row.title}
                          </Link>
                        </TableCell>
                        <TableCell align="center" width="12%">
                          {getStatus(row.status)}
                        </TableCell>
                        <TableCell align="center" width="12%">
                          {getPriority(row.priority)}
                        </TableCell>
                        <TableCell align="center" width="12%">
                          {row.startDate}
                        </TableCell>
                        <TableCell align="center" width="12%">
                          {row.endDate}
                        </TableCell>
                        <TableCell align="center" width="12%">
                          <IconButton
                            aria-label={`edit task - ${row.taskId}`}
                            onClick={() => handleEditTask(row.taskId)}
                            color="primary"
                            edge="start"
                            size="medium"
                            disabled={row.status === 'completed' || row.status === 'cancelled'}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            aria-label={`delet task - ${row.taskId}`}
                            color="error"
                            onClick={() => handleDeleteTask(row.taskId)}
                            edge="end"
                            size="medium"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1}>
                    <TableCell align="center" colSpan={7}>
                      <Typography>No records found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filterTableRow.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </MainCard>
      <CustomDialog
        open={dialog.open}
        handleClose={handleCancel}
        title={dialog.title}
        description={dialog.description}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        handleConfirm={handleConfirm}
        confirmVariant={'error'}
        customValue={dialog.customValue}
      />
      <AlertSnackBar open={snackBar} onClose={handleSnackbar} severity="success" message={`Task deleted sucessfully!`} />
    </>
  );
};

export default InprogressTable;
