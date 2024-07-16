import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Heading,
  NumberInput,
  Stack,
  TextInput,
  InlineNotification,
} from '@carbon/react';
import {
  Document,
  Font,
  // Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

// Styles
import './App.scss';

// Fonts
Font.register({
  family: 'PasticheGrotesque',
  fonts: [
    { src: '/fonts/PasticheGrotesqueTT-Regular.ttf' },
    { src: '/fonts/PasticheGrotesqueTT-SemiBold.ttf', fontWeight: '700', fontStyle: 'normal' },
  ]
});

// PDF Styles
const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  heading: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  page: {
    flexDirection: 'column',
    fontFamily: 'PasticheGrotesque',
    fontSize: '12px',
    padding: 48,
  },
  section: {
    marginTop: 24,
  },
  split: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subheading: {
    fontWeight: '700',
  },
  subsection: {
    marginTop: 12,
  },
});

function App() {
  const [formError, setFormError] = useState(null);
  const [data, setData] = useState(null);

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState:
    {
      errors,
      isDirty,
      isSubmitting

    },
    watch,
  } = useForm({
    defaultValues: {
      experienceCount: 4,
      username: 'nimrodram',
      'withEducation': true,
    },
  });

  const { experienceCount, withEducation } = watch();

  const onSubmit = async (formData) => {
    try {
      const params = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/get-profile?${params}`);
      const data = await response.json();

      if (data?.error) {
        setFormError(data);
      } else {
        setData(data);
      }
    } catch (e) {
      setFormError(e);
    }
  };

  return (
    <div>
      <Stack gap={7}>
        <Heading>Generate Résumé From LinkedIn Profile</Heading>
        <Form noValidate aria-label="sample form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={7}>
            <TextInput
              disabled={isSubmitting}
              helperText={<>The Username will be the last segment of the person’s profile URL (e.g. https://www.linkedin.com/in/<u>nimrodram</u>/)</>}
              id="input-name"
              invalid={'username' in errors}
              invalidText={errors?.username?.message}
              labelText="LinkedIn Username/ID"
              {...register('username', { required: 'Username is required.' })}
            />
            <Controller
              control={control}
              name="experienceCount"
              render={({ field: { onChange, ...rest } }) => (
                <NumberInput
                  disabled={isSubmitting}
                  id="input-number-experience"
                  min={2}
                  label="Number of jobs to include in “Experience” section"
                  invalid={'experienceCount' in errors}
                  invalidText={errors?.experienceCount?.message}
                  onChange={(_, { value }) => onChange(value)}
                  {...rest}
                />
              )}
              rules={{ required: 'Number of jobs is required.' }}
            />
            <CheckboxGroup legendText="Sections to include:">
              <Checkbox
                disabled={isSubmitting}
                id="input-withEducation"
                labelText="Education"
                {...register('withEducation')}
              />
            </CheckboxGroup>
            {formError ? (
              <InlineNotification
                lowContrast
                kind="error"
                role="status"
                statusIconDescription="notification"
                subtitle={formError.message}
                timeout={0}
                title={`Error (${formError.code}):`}
              />
            ) : null}
            <div className="form-footer">
              {isDirty ? (
                <Button
                  disabled={isSubmitting}
                  kind="ghost"
                  onClick={() => reset(undefined, { keepDefaultValues: true })}
                  type="button"
                >
                  Reset
                </Button>
              ) : <div />}
              <Button disabled={isSubmitting} type="submit">Generate Résumé</Button>
            </div>
          </Stack>
        </Form>
      </Stack>
      {data ? (
        <main className="resume">
          <Button
            className="dismiss"
            kind="tertiary"
            onClick={() => setData(null)}
            type="button"
          >
            Close
          </Button>
          <PDFViewer>
            <Document>
              <Page size="A4" style={styles.page}>
                {/* <Image src={data.profile_pic_url} /> */}
                <View style={styles.header}>
                  <Text style={styles.heading}>{data.full_name}</Text>
                  <Text>{data.experiences[0].title}</Text>
                  <View style={styles.split}>
                    {data?.personal_emails?.[0] ? <Text>{data.personal_emails[0]}</Text> : null}
                    {data?.personal_numbers?.[0] ? <Text>{data.personal_numbers[0]}</Text> : null}
                    {data?.public_identifier ? <Text>https://www.linkedin.com/in/{data.public_identifier}/</Text> : null}
                  </View>
                </View>
                {data?.summary ? (
                  <View style={styles.section}>
                    <Text style={styles.heading}>Summary</Text>
                    <Text>{data.summary}</Text>
                  </View>
                ) : null}
                {data.skills.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.heading}>Skills</Text>
                    <Text>{data.skills.sort().join(', ')}</Text>
                  </View>
                ) : null}
                {data.experiences.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.heading}>Experience</Text>
                    {data.experiences.filter((_, idx) => idx < experienceCount).map((experience) => (
                      <View key={`${experience.company_linkedin_profile_url}/${experience.title}`} style={styles.subsection}>
                        <Text style={styles.subheading}>{experience.company}</Text>
                        <Text>{experience.title}</Text>
                        <Text>
                          {experience?.starts_at?.month ? `${String(experience.starts_at.month).padStart(2, '0')}/${experience.starts_at.year}` : null}
                          {' '}–{' '}
                          {experience?.ends_at?.month ? `${String(experience.ends_at.month).padStart(2, '0')}/${experience.ends_at.year}` : <>Current</>}
                        </Text>
                        {experience.description ? <Text>{experience.description}</Text> : null}
                      </View>
                    ))}
                  </View>
                ) : null}
                {withEducation && data.education.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.heading}>Education</Text>
                    {data.education.map((entry) => (
                      <View key={entry.school} style={styles.subsection}>
                        <Text style={styles.subheading}>{entry.school}</Text>
                        {entry?.field_of_study ? <Text>{entry.field_of_study}</Text> : null}
                        {entry?.degree_name ? <Text>{entry.degree_name}</Text> : null}
                        {entry?.starts_at?.month ? (
                          <Text>
                            {String(entry.starts_at.month).padStart(2, '0')}/{entry.starts_at.year}
                            {' '}–{' '}
                            {entry?.ends_at?.month ? `${String(entry.ends_at.month).padStart(2, '0')}/${entry.ends_at.year}` : <>Current</>}
                          </Text>
                        ) : null}
                        {entry.description ? <Text>{entry.description}</Text> : null}
                      </View>
                    ))}
                  </View>
                ) : null}
              </Page>
            </Document>
          </PDFViewer>
        </main>
      ) : null}
    </div>
  );
}

export default App;
