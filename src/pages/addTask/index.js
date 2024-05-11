import { useState } from 'react';
import { FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography, Select, MenuItem, Button } from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/de';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import AnimateButton from 'components/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from 'store/reducers/tasks';
import AlertSnackBar from '../../components/SnackBar';
import { useNavigate } from 'react-router-dom';

const status = [
  { value: 'todo', label: 'Todo' },
  { value: 'inprogress', label: 'In-Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const AddTask = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks } = useSelector((state) => state.tasks);

  const taskId = location?.state?.taskId;
  const isEditPage = !isEmpty(taskId);
  const formValues = tasks.find((o) => o.taskId === taskId);

  const [open, setOpen] = useState(false);

  const handleSnackBar = () => {
    setOpen((prev) => !prev);
  };

  const filteredStatus = isEditPage ? status : status.filter((o, index) => index <= 1);

  const disabledStatusIndex = filteredStatus.findIndex((o) => o.value === formValues?.status);

  return (
    <Grid>
      <Grid container rowSpacing={8} columnSpacing={5}>
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">{isEditPage ? 'Edit' : 'Add'} Task</Typography>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <Formik
            initialValues={{
              title: formValues?.title ?? '',
              priority: formValues?.priority ?? '',
              status: formValues?.status ?? 'todo',
              startDate: formValues?.startDate ? moment(formValues.startDate, 'DD/MM/YYYY') : moment(),
              endDate: formValues?.endDate ? moment(formValues.endDate, 'DD/MM/YYYY') : null,
              description: formValues?.description ?? ''
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().required('Title is required'),
              priority: Yup.string().required('Priority is required'),
              status: Yup.string().required('Status is required'),
              startDate: Yup.date().nullable(),
              endDate: Yup.date().required('Due date is required'),
              description: Yup.string().required('Description is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
              try {
                const payload = {
                  ...values,
                  startDate: values.startDate.format('DD/MM/YYYY'),
                  endDate: values.endDate.format('DD/MM/YYYY')
                };
                if (isEditPage) {
                  dispatch(updateTask({ taskId, updates: payload }));
                } else {
                  dispatch(addTask(payload));
                }

                setStatus({ success: false });
                setSubmitting(false);
                resetForm();
                handleSnackBar();
                setTimeout(() => {
                  navigate('/tasks', { replace: true });
                }, 2000);
              } catch (err) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
                resetForm();
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue, isSubmitting }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} sm={12} lg={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="task-title">Title</InputLabel>
                      <OutlinedInput
                        id="task-title"
                        type="text"
                        value={values.title}
                        name="title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter title"
                        fullWidth
                        error={Boolean(touched.title && errors.title)}
                      />
                      {touched.title && errors.title && (
                        <FormHelperText error id="task-title-error">
                          {errors.title}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6} sm={6} lg={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="task-priority">Priority</InputLabel>
                      <Select
                        id="task-priority"
                        name="priority"
                        displayEmpty
                        value={values.priority}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={Boolean(touched.priority && errors.priority)}
                      >
                        <MenuItem value={''} disabled={isEditPage}>
                          Select priority
                        </MenuItem>
                        <MenuItem value={'low'}>Low</MenuItem>
                        <MenuItem value={'medium'}>Medium</MenuItem>
                        <MenuItem value={'high'}>High</MenuItem>
                      </Select>
                      {touched.priority && errors.priority && (
                        <FormHelperText error id="task-priority-error">
                          {errors.priority}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6} sm={6} lg={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="task-status">Status</InputLabel>
                      <Select
                        id="task-status"
                        name="status"
                        displayEmpty
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={Boolean(touched.status && errors.status)}
                      >
                        <MenuItem value={''} disabled={isEditPage}>
                          Select status
                        </MenuItem>
                        {filteredStatus.map((item, key) => {
                          return (
                            <MenuItem key={key} value={item.value} disabled={key < disabledStatusIndex}>
                              {item.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {touched.status && errors.status && (
                        <FormHelperText error id="task-status-error">
                          {errors.status}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6} sm={6} lg={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="task-startDate">Start date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-us">
                        <DatePicker
                          id="task-startDate"
                          format="DD/MM/YYYY"
                          minDate={moment()}
                          value={values.startDate}
                          onChange={(value) => setFieldValue('startDate', value)}
                          error={Boolean(touched.startDate && errors.startDate)}
                        />
                      </LocalizationProvider>
                      {touched.startDate && errors.startDate && (
                        <FormHelperText error id="task-startDate-error">
                          {errors.startDate}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6} sm={6} lg={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="task-endDate">Due date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-us">
                        <DatePicker
                          id="task-endDate"
                          format="DD/MM/YYYY"
                          minDate={values.startDate}
                          value={values.endDate}
                          onChange={(value) => setFieldValue('endDate', value)}
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              error: Boolean(touched.endDate && errors.endDate)
                            }
                          }}
                          onBlur={handleBlur}
                        />
                      </LocalizationProvider>
                      {touched.endDate && errors.endDate && (
                        <FormHelperText error id="task-endDate-error">
                          {errors.endDate}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={12} sm={12} lg={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="task-description">Description</InputLabel>
                      <Grid item xs={12} md={12} sm={12} lg={12} />
                      <CKEditor
                        editor={ClassicEditor}
                        data={values.description}
                        onChange={(_event, editor) => {
                          const data = editor.getData();
                          setFieldValue('description', data);
                        }}
                      />
                      {touched.description && errors.description && (
                        <FormHelperText error id="task-description-error">
                          {errors.description}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid lg={9} sm={9} md={9} />
                  <Grid item xs={12} md={3} sm={3} lg={3}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="medium"
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: '10px'
                        }}
                      >
                        {isEditPage ? 'Update' : 'Add'}
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
      <AlertSnackBar
        open={open}
        onClose={handleSnackBar}
        severity="success"
        message={`Hurray!!! Task ${isEditPage ? 'updated' : 'added'} sucessfully!`}
      />
    </Grid>
  );
};

export default AddTask;
