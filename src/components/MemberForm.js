
// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Alert } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { createMember, getMemberById, updateMember } from '../services/api';

// const MemberForm = () => {
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [initialValues, setInitialValues] = useState({
//     name: '',
//     address: '',
//     dob: '',
//     healthConditions: '',
//     membershipDuration: 1,
//     membershipStartDate: new Date().toISOString().split('T')[0],
//     paidFee: 0,
//     pendingFee: 0,
//     workoutPlan: '',
//     bodyWeight: '',
//     bodyMeasurements: {
//       chest: '',
//       waist: '',
//       hips: '',
//       abs: '',
//       arms: ''
//     },
//     mobileNumber: '',
//     emergencyContactNumber: ''
//   });

//   useEffect(() => {
//     if (!isEdit) return;

//     const fetchMember = async () => {
//       try {
//         const member = await getMemberById(id);
//         const formatted = {
//           ...member,
//           dob: formatDate(member.dob),
//           membershipStartDate: formatDate(member.membershipStartDate),
//           membershipEndDate: formatDate(member.membershipEndDate),
//           bodyMeasurements: {
//             chest: '',
//             waist: '',
//             hips: '',
//             abs: '',
//             arms: '',
//             ...member.bodyMeasurements
//           }
//         };
//         setInitialValues(formatted);
//       } catch {
//         setError('Failed to fetch member data.');
//         setTimeout(() => setError(''), 1000);
//       }
//     };

//     fetchMember();
//   }, [id, isEdit]);

//   const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

//   const calculateEndDate = (startDate, duration) => {
//     const date = new Date(startDate);
//     date.setMonth(date.getMonth() + parseInt(duration));
//     return formatDate(date);
//   };

//   const validationSchema = Yup.object({
//     name: Yup.string().required('Name is required'),
//     address: Yup.string().required('Address is required'),
//     dob: Yup.date().required('Date of Birth is required'),
//     membershipDuration: Yup.number().required('Membership duration is required'),
//     membershipStartDate: Yup.date().required('Start date is required'),
//     paidFee: Yup.number().required('Paid fee is required'),
//     mobileNumber: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number').required('Mobile is required'),
//     emergencyContactNumber: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number').required('Emergency contact is required')
//   });

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const memberData = {
//         ...values,
//         membershipEndDate: calculateEndDate(values.membershipStartDate, values.membershipDuration)
//       };

//       if (isEdit) {
//         await updateMember(id, memberData);
//         setSuccess('Member updated successfully!');
//       } else {
//         await createMember(memberData);
//         setSuccess('Member registered successfully!');
//         resetForm();
//       }

//       setTimeout(() => {
//         setSuccess('');
//         navigate('/members');
//       }, 1500);
//     } catch (err) {
//       console.error('Save error:', err);
//       setError('Failed to save member data.');
//       setTimeout(() => setError(''), 1000);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h3 className="mb-4 text-center">{isEdit ? 'Edit Member' : 'Register Member'}</h3>

//       {/* Floating Center Popup */}
//       {(success || error) && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '40%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: 9999,
//             minWidth: '300px',
//             textAlign: 'center'
//           }}
//         >
//           <Alert variant={success ? 'success' : 'danger'}>
//             {success || error}
//           </Alert>
//         </div>
//       )}

//       <Card>
//         <Card.Body>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
//               <Form onSubmit={handleSubmit}>
//                 {[ // fields
//                   { label: 'Name', name: 'name', type: 'text' },
//                   { label: 'Date of Birth', name: 'dob', type: 'date' },
//                   { label: 'Mobile Number', name: 'mobileNumber', type: 'text' },
//                   { label: 'Emergency Contact', name: 'emergencyContactNumber', type: 'text' },
//                   { label: 'Address', name: 'address', type: 'textarea' },
//                   { label: 'Health Conditions', name: 'healthConditions', type: 'textarea' },
//                   { label: 'Workout Plan', name: 'workoutPlan', type: 'textarea' },
//                   { label: 'Body Weight (kg)', name: 'bodyWeight', type: 'number' },
//                   { label: 'Chest (cm)', name: 'bodyMeasurements.chest', type: 'number' },
//                   { label: 'Waist (cm)', name: 'bodyMeasurements.waist', type: 'number' },
//                   { label: 'Hips (cm)', name: 'bodyMeasurements.hips', type: 'number' },
//                   { label: 'Abs (cm)', name: 'bodyMeasurements.abs', type: 'number' },
//                   { label: 'Arms (cm)', name: 'bodyMeasurements.arms', type: 'number' },
//                   { label: 'Membership Duration (months)', name: 'membershipDuration', type: 'number' },
//                   { label: 'Start Date', name: 'membershipStartDate', type: 'date' },
//                   { label: 'Paid Fee', name: 'paidFee', type: 'number' },
//                   { label: 'Pending Fee', name: 'pendingFee', type: 'number' }
//                 ].map(({ label, name, type }) => {
//                   const value = name.includes('.') ? name.split('.').reduce((obj, key) => obj?.[key] ?? '', values) : values[name];
//                   const error = name.includes('.') ? null : errors[name];
//                   const touch = name.includes('.') ? null : touched[name];

//                   return (
//                     <Form.Group className="mb-3 d-flex align-items-center" key={name}>
//                       <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>{label} -</Form.Label>
//                       {type === 'textarea' ? (
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           name={name}
//                           value={value}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           isInvalid={touch && error}
//                         />
//                       ) : (
//                         <Form.Control
//                           type={type}
//                           name={name}
//                           value={value}
//                           onChange={(e) => {
//                             if (name.includes('.')) {
//                               const [parent, child] = name.split('.');
//                               setFieldValue(`${parent}.${child}`, e.target.value);
//                             } else {
//                               handleChange(e);
//                             }
//                           }}
//                           onBlur={handleBlur}
//                           isInvalid={touch && error}
//                         />
//                       )}
//                       {error && touch && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
//                     </Form.Group>
//                   );
//                 })}

//                 {/* Read-only End Date */}
//                 <Form.Group className="mb-3 d-flex align-items-center">
//                   <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>End Date -</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={calculateEndDate(values.membershipStartDate, values.membershipDuration)}
//                     readOnly
//                     disabled
//                   />
//                 </Form.Group>

//                 <div className="text-end">
//                   <Button variant="secondary" className="me-2" onClick={() => navigate('/members')}>Cancel</Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Register Member'}
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default MemberForm;

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Alert } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { createMember, getMemberById, updateMember } from '../services/api';

// const MemberForm = () => {
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [initialValues, setInitialValues] = useState({
//     name: '',
//     address: '',
//     dob: '',
//     healthConditions: '',
//     membershipDuration: 1,
//     membershipStartDate: new Date().toISOString().split('T')[0],
//     paidFee: 0,
//     pendingFee: 0,
//     workoutPlan: '',
//     bodyWeight: '',
//     bodyMeasurements: {
//       chest: '',
//       waist: '',
//       hips: '',
//       abs: '',
//       arms: ''
//     },
//     mobileNumber: '',
//     emergencyContactNumber: ''
//   });

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) {
//       console.warn("Invalid date in formatDate:", dateStr);
//       return '';
//     }
//     return date.toISOString().split('T')[0];
//   };

//   const calculateEndDate = (startDate, duration) => {
//     const date = new Date(startDate);
//     if (isNaN(date.getTime()) || isNaN(duration)) {
//       console.warn("Invalid inputs in calculateEndDate:", startDate, duration);
//       return '';
//     }
//     date.setMonth(date.getMonth() + parseInt(duration));
//     return formatDate(date);
//   };

//   useEffect(() => {
//     if (!isEdit) return;

//     const fetchMember = async () => {
//       try {
//         const member = await getMemberById(id);
//         const formatted = {
//           ...member,
//           dob: member.dob ? formatDate(member.dob) : '',
//           membershipStartDate: member.membershipStartDate ? formatDate(member.membershipStartDate) : '',
//           membershipEndDate: member.membershipEndDate ? formatDate(member.membershipEndDate) : '',
//           bodyMeasurements: {
//             chest: '',
//             waist: '',
//             hips: '',
//             abs: '',
//             arms: '',
//             ...member.bodyMeasurements
//           }
//         };
//         setInitialValues(formatted);
//       } catch {
//         setError('Failed to fetch member data.');
//         setTimeout(() => setError(''), 1000);
//       }
//     };

//     fetchMember();
//   }, [id, isEdit]);

//   const validationSchema = Yup.object({
//     name: Yup.string().required('Name is required'),
//     address: Yup.string().required('Address is required'),
//     dob: Yup.date().required('Date of Birth is required'),
//     membershipDuration: Yup.number().required('Membership duration is required'),
//     membershipStartDate: Yup.date().required('Start date is required'),
//     paidFee: Yup.number().required('Paid fee is required'),
//     mobileNumber: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number').required('Mobile is required'),
//     emergencyContactNumber: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number').required('Emergency contact is required')
//   });

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const memberData = {
//         ...values,
//         membershipEndDate: calculateEndDate(values.membershipStartDate, values.membershipDuration)
//       };

//       if (isEdit) {
//         await updateMember(id, memberData);
//         setSuccess('Member updated successfully!');
//       } else {
//         await createMember(memberData);
//         setSuccess('Member registered successfully!');
//         resetForm();
//       }

//       setTimeout(() => {
//         setSuccess('');
//         navigate('/members');
//       }, 1500);
//     } catch (err) {
//       console.error('Save error:', err);
//       setError('Failed to save member data.');
//       setTimeout(() => setError(''), 1000);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h3 className="mb-4 text-center">{isEdit ? 'Edit Member' : 'Register Member'}</h3>

//       {(success || error) && (
//         <div
//           style={{
//             position: 'fixed',
//             top: '40%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: 9999,
//             minWidth: '300px',
//             textAlign: 'center'
//           }}
//         >
//           <Alert variant={success ? 'success' : 'danger'}>
//             {success || error}
//           </Alert>
//         </div>
//       )}

//       <Card>
//         <Card.Body>
//           <Formik
//             initialValues={initialValues}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
//               <Form onSubmit={handleSubmit}>
//                 {[
//                   { label: 'Name', name: 'name', type: 'text' },
//                   { label: 'Date of Birth', name: 'dob', type: 'date' },
//                   { label: 'Mobile Number', name: 'mobileNumber', type: 'text' },
//                   { label: 'Emergency Contact', name: 'emergencyContactNumber', type: 'text' },
//                   { label: 'Address', name: 'address', type: 'textarea' },
//                   { label: 'Health Conditions', name: 'healthConditions', type: 'textarea' },
//                   { label: 'Workout Plan', name: 'workoutPlan', type: 'textarea' },
//                   { label: 'Body Weight (kg)', name: 'bodyWeight', type: 'number' },
//                   { label: 'Chest (cm)', name: 'bodyMeasurements.chest', type: 'number' },
//                   { label: 'Waist (cm)', name: 'bodyMeasurements.waist', type: 'number' },
//                   { label: 'Hips (cm)', name: 'bodyMeasurements.hips', type: 'number' },
//                   { label: 'Abs (cm)', name: 'bodyMeasurements.abs', type: 'number' },
//                   { label: 'Arms (cm)', name: 'bodyMeasurements.arms', type: 'number' },
//                   { label: 'Membership Duration (months)', name: 'membershipDuration', type: 'number' },
//                   { label: 'Start Date', name: 'membershipStartDate', type: 'date' },
//                   { label: 'Paid Fee', name: 'paidFee', type: 'number' },
//                   { label: 'Pending Fee', name: 'pendingFee', type: 'number' }
//                 ].map(({ label, name, type }) => {
//                   const value = name.includes('.') ? name.split('.').reduce((obj, key) => obj?.[key] ?? '', values) : values[name];
//                   const error = name.includes('.') ? null : errors[name];
//                   const touch = name.includes('.') ? null : touched[name];

//                   return (
//                     <Form.Group className="mb-3 d-flex align-items-center" key={name}>
//                       <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>{label} -</Form.Label>
//                       {type === 'textarea' ? (
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           name={name}
//                           value={value}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                           isInvalid={touch && error}
//                         />
//                       ) : (
//                         <Form.Control
//                           type={type}
//                           name={name}
//                           value={value}
//                           onChange={(e) => {
//                             if (name.includes('.')) {
//                               const [parent, child] = name.split('.');
//                               setFieldValue(`${parent}.${child}`, e.target.value);
//                             } else {
//                               handleChange(e);
//                             }
//                           }}
//                           onBlur={handleBlur}
//                           isInvalid={touch && error}
//                         />
//                       )}
//                       {error && touch && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
//                     </Form.Group>
//                   );
//                 })}

//                 <Form.Group className="mb-3 d-flex align-items-center">
//                   <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>End Date -</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={calculateEndDate(values.membershipStartDate, values.membershipDuration)}
//                     readOnly
//                     disabled
//                   />
//                 </Form.Group>

//                 <div className="text-end">
//                   <Button variant="secondary" className="me-2" onClick={() => navigate('/members')}>Cancel</Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Register Member'}
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default MemberForm;



import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createMember, getMemberById, updateMember } from '../services/api';

const MemberForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [initialValues, setInitialValues] = useState({
    name: '',
    address: '',
    dob: '',
    healthConditions: '',
    membershipDuration: 1,
    membershipStartDate: new Date().toISOString().split('T')[0],
    paidFee: 0,
    pendingFee: 0,
    workoutPlan: '',
    bodyWeight: '',
    bodyMeasurements: {
      chest: '',
      waist: '',
      hips: '',
      abs: '',
      arms: ''
    },
    mobileNumber: '',
    emergencyContactNumber: ''
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date in formatDate:", dateStr);
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  const calculateEndDate = (startDate, duration) => {
    const date = new Date(startDate);
    if (isNaN(date.getTime()) || isNaN(duration)) {
      console.warn("Invalid inputs in calculateEndDate:", startDate, duration);
      return '';
    }
    date.setMonth(date.getMonth() + parseInt(duration));
    return formatDate(date);
  };

  useEffect(() => {
    if (!isEdit) return;

    const fetchMember = async () => {
      try {
        const member = await getMemberById(id);
        const formatted = {
          ...member,
          dob: member.dob ? formatDate(member.dob) : '',
          membershipStartDate: member.membershipStartDate ? formatDate(member.membershipStartDate) : '',
          membershipEndDate: member.membershipEndDate ? formatDate(member.membershipEndDate) : '',
          bodyMeasurements: {
            chest: '',
            waist: '',
            hips: '',
            abs: '',
            arms: '',
            ...member.bodyMeasurements
          }
        };
        setInitialValues(formatted);
      } catch {
        setError('Failed to fetch member data.');
        setTimeout(() => setError(''), 1000);
      }
    };

    fetchMember();
  }, [id, isEdit]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    dob: Yup.date().required('Date of Birth is required'),
    membershipDuration: Yup.number().required('Membership duration is required'),
    membershipStartDate: Yup.date().required('Start date is required'),
    paidFee: Yup.number().required('Paid fee is required'),
    mobileNumber: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number').required('Mobile is required'),
    emergencyContactNumber: Yup.string().matches(/^\d{10}$/, 'Enter a valid 10-digit number').required('Emergency contact is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const memberData = {
        ...values,
        membershipEndDate: calculateEndDate(values.membershipStartDate, values.membershipDuration)
      };

      if (isEdit) {
        await updateMember(id, memberData);
        setSuccess('Member updated successfully!');
      } else {
        await createMember(memberData);
        setSuccess('Member registered successfully!');
        resetForm();
      }

      setTimeout(() => {
        setSuccess('');
        navigate('/members');
      }, 1500);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save member data.');
      setTimeout(() => setError(''), 1000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">{isEdit ? 'Edit Member' : 'Register Member'}</h3>

      {(success || error) && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            minWidth: '300px',
            textAlign: 'center'
          }}
        >
          <Alert variant={success ? 'success' : 'danger'}>
            {success || error}
          </Alert>
        </div>
      )}

      <Card>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                {[
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Date of Birth', name: 'dob', type: 'date' },
                  { label: 'Mobile Number', name: 'mobileNumber', type: 'text' },
                  { label: 'Emergency Contact', name: 'emergencyContactNumber', type: 'text' },
                  { label: 'Address', name: 'address', type: 'textarea' },
                  { label: 'Health Conditions', name: 'healthConditions', type: 'textarea' },
                  { label: 'Workout Plan', name: 'workoutPlan', type: 'textarea' },
                  { label: 'Body Weight (kg)', name: 'bodyWeight', type: 'number' },
                  { label: 'Chest (cm)', name: 'bodyMeasurements.chest', type: 'number' },
                  { label: 'Waist (cm)', name: 'bodyMeasurements.waist', type: 'number' },
                  { label: 'Hips (cm)', name: 'bodyMeasurements.hips', type: 'number' },
                  { label: 'Abs (cm)', name: 'bodyMeasurements.abs', type: 'number' },
                  { label: 'Arms (cm)', name: 'bodyMeasurements.arms', type: 'number' },
                  { label: 'Membership Duration (months)', name: 'membershipDuration', type: 'select', options: [1, 3, 6, 12] },
                  { label: 'Start Date', name: 'membershipStartDate', type: 'date' },
                  { label: 'Paid Fee', name: 'paidFee', type: 'number' },
                  { label: 'Pending Fee', name: 'pendingFee', type: 'number' }
                ].map(({ label, name, type, options }) => {
                  const value = name.includes('.') ? name.split('.').reduce((obj, key) => obj?.[key] ?? '', values) : values[name];
                  const error = name.includes('.') ? null : errors[name];
                  const touch = name.includes('.') ? null : touched[name];

                  return (
                    <Form.Group className="mb-3 d-flex align-items-center" key={name}>
                      <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>{label} -</Form.Label>
                      {type === 'textarea' ? (
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name={name}
                          value={value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touch && error}
                        />
                      ) : type === 'select' ? (
                        <Form.Select
                          name={name}
                          value={value}
                          onChange={(e) => setFieldValue(name, parseInt(e.target.value))}
                          isInvalid={touch && error}
                        >
                          <option value="">Select duration</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>{opt} months</option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={type}
                          name={name}
                          value={value}
                          onChange={(e) => {
                            if (name.includes('.')) {
                              const [parent, child] = name.split('.');
                              setFieldValue(`${parent}.${child}`, e.target.value);
                            } else {
                              handleChange(e);
                            }
                          }}
                          onBlur={handleBlur}
                          isInvalid={touch && error}
                        />
                      )}
                      {error && touch && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                    </Form.Group>
                  );
                })}

                <Form.Group className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-3" style={{ minWidth: '250px', fontWeight: 'bold' }}>End Date -</Form.Label>
                  <Form.Control
                    type="date"
                    value={calculateEndDate(values.membershipStartDate, values.membershipDuration)}
                    readOnly
                    disabled
                  />
                </Form.Group>

                <div className="text-end">
                  <Button variant="secondary" className="me-2" onClick={() => navigate('/members')}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Register Member'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MemberForm;


