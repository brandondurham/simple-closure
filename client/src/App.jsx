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
import Markdown from 'react-markdown';
import {
  Document,
  Font,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

// Styles
import './App.scss';

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

const DUMMY_DATA = {
  "public_identifier": "nimrodram",
  "profile_pic_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/person/nimrodram/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004007Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=cb5b54c0008f4d6b248cdfc49b61b8e5541e39f5115c16184916a86de7274147",
  "background_cover_image_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/person/nimrodram/cover?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004007Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=f027b61ef11d2afc1c641691b507d8366facd7ac01f38c08af6eda8f8509dbca",
  "first_name": "Nimrod",
  "last_name": "Ram",
  "full_name": "Nimrod Ram",
  "occupation": "Co-Founder, CTO at SimpleClosure",
  "headline": "Co-Founder, CTO at SimpleClosure",
  "summary": "\"Programming is an art form that fights back\"",
  "country": "US",
  "country_full_name": "United States",
  "city": "New York",
  "state": "New York",
  "experiences": [
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2023
      },
      "company": "SimpleClosure",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/simpleclosure",
      "title": "Co-Founder, CTO",
      "description": null,
      "location": null,
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/simpleclosure/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=43adf9157184e0312c4b49e9cb5574174f80d83b4a8ee04b0e951c3607885fb9"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 10,
        "year": 2013
      },
      "ends_at": {
        "day": 31,
        "month": 5,
        "year": 2023
      },
      "company": "Riskified",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/riskified",
      "title": "Head of Innovation",
      "description": "• Joined shortly after the seed round as a full-stack developer, subsequently served as developer team lead, VP R&D and VP Integrations prior to the IPO in 2020.\n\n• Recruited, trained, and managed multiple teams of developers, data scientists, integration engineers, data integrity engineers, account managers, and customer service representatives across two continents over the past decade.",
      "location": "New York, New York, United States · On-site",
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/riskified/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=6e62a61f6e32a9be065947445de18da4099186ab3e8d0953b3cead5e81702438"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2008
      },
      "ends_at": {
        "day": 31,
        "month": 7,
        "year": 2017
      },
      "company": "Bezalel Academy of Art and Design",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/bezalel-academy-of-arts-and-design-jerusalem",
      "title": "Adjunct Lecturer",
      "description": "• Development of a unique syllabus for non-programmers that encompasses audio and visual real-time synthesis and analysis tools.\n\n• Design and implementation of an online course management system for the academy's Contemporary Media division.",
      "location": "Jerusalem",
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/bezalel-academy-of-arts-and-design-jerusalem/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=c0f00b4e5f4b53fd3207ad596cf269f4ecf465dc35d7a837fd13f376bf0d7678"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 4,
        "year": 2010
      },
      "ends_at": {
        "day": 30,
        "month": 4,
        "year": 2014
      },
      "company": "Epoch.",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/epoch-",
      "title": "Co-founder and CTO",
      "description": "• Co-Founder, CEO & CTO of Deja, Inc., a cross-platform video startup focused on predictive content curation and seamless user experience.\n\n• Merged with SF-based startup Oonum, Inc. to form Epoch, Inc. and grew to 13 employees to pursue enterprise cooperations.\n\n• Forced to close shop following exhaustion of funds.",
      "location": "San Francisco Bay Area",
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/epoch-/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004019Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=49230599f7dd20675003b3b36043eca6c75d3ca7f62a9dfec630e9f512bf10ca"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2004
      },
      "ends_at": {
        "day": 31,
        "month": 12,
        "year": 2010
      },
      "company": "MEET - Middle East Entrepreneurs of Tomorrow",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/meet---middle-east-education-through-technology",
      "title": "Lead Java Tutor",
      "description": "• MIT-backed peace initiative in Jerusalem, teaching Java and business management skills to a mixed group of Israeli and Palestinian teenagers.\n\n• Weekly mentorship and instruction of students, preparation of annual curriculum, supervision of hired tutors and computer lab administration.",
      "location": "Jerusalem",
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/meet---middle-east-education-through-technology/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=d489dcb033488fe94af8d3b832fca0f324083a52e2a48fcbb1025f1ba2e47235"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 11,
        "year": 2008
      },
      "ends_at": {
        "day": 31,
        "month": 7,
        "year": 2010
      },
      "company": "HIT - Holon Institute of Technology",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/hit---holon-institute-of-technlogy",
      "title": "Adjunct Lecturer",
      "description": "• Co-Instructor of an interdisciplinary workshop in Interaction Design.\n\n• Course technologies include Arduino micro-controllers, Phidgets sensors, Processing/Wiring and Max/MSP/Jitter development environments.",
      "location": "Holon",
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/hit---holon-institute-of-technlogy/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=e8392bf08175461a2707358874d9cbe9bf117d3fb4839a71647a0ce601499985"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2007
      },
      "ends_at": {
        "day": 31,
        "month": 12,
        "year": 2010
      },
      "company": "Israel Ministry of Defense",
      "company_linkedin_profile_url": null,
      "title": "System Specialist",
      "description": null,
      "location": null,
      "logo_url": null
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2003
      },
      "ends_at": {
        "day": 31,
        "month": 12,
        "year": 2005
      },
      "company": "Studio Art Magazine",
      "company_linkedin_profile_url": null,
      "title": "Research Assistant",
      "description": "• Preparation of artist/curator profiles and research of contemporary art organizations and events.\n\n• As a side-project, design and implementation of a custom solution to structure and archive the magazine’s collection of art-related information.",
      "location": "Tel Aviv",
      "logo_url": null
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 1998
      },
      "ends_at": {
        "day": 31,
        "month": 12,
        "year": 2002
      },
      "company": "Israeli Air Force",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/israeli-air-force",
      "title": "Intelligence Officer",
      "description": "• Major (res.)",
      "location": null,
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/israeli-air-force/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=5e91073a6c29b79de4bd1bf4055d7f3a886ddcbc4ab009b5ca6fc4e76b15077f"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 1995
      },
      "ends_at": {
        "day": 31,
        "month": 1,
        "year": 1997
      },
      "company": "Giant Steps",
      "company_linkedin_profile_url": "https://www.linkedin.com/company/giant-steps",
      "title": "Programmer",
      "description": "• Computer game software company that specialized in RPGs.\n\n• Employed during summer vacations, first startup environment experience.",
      "location": "Herzeliya",
      "logo_url": "https://media.licdn.com/dms/image/C510BAQHbb9tECVpXBA/company-logo_400_400/0/1631312322906?e=1727913600&v=beta&t=dHogsjhjUJe9VqULO8eIq0-2zqsOUp8rlhDtlV7K7IA"
    }
  ],
  "education": [
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2002
      },
      "ends_at": {
        "day": 31,
        "month": 12,
        "year": 2007
      },
      "field_of_study": "Computer Science",
      "degree_name": "Bachelor of Science (BSc)",
      "school": "The Hebrew University of Jerusalem",
      "school_linkedin_profile_url": "https://www.linkedin.com/company/3153/",
      "description": null,
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/hebrew-university/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=a23b3019d87fe4ec273e0527d6c5dab462b1df789b8062e3f687b30de3060354"
    },
    {
      "starts_at": {
        "day": 1,
        "month": 1,
        "year": 2002
      },
      "ends_at": {
        "day": 31,
        "month": 12,
        "year": 2007
      },
      "field_of_study": "Fine Art",
      "degree_name": "Bachelor of Fine Arts (BFA)",
      "school": "Bezalel Academy of Art and Design",
      "school_linkedin_profile_url": "https://www.linkedin.com/company/bezalel-academy-of-arts-and-design-jerusalem",
      "description": "magna cum laude in history and theory studies",
      "logo_url": "https://s3.us-west-000.backblazeb2.com/proxycurl/company/bezalel-academy-of-arts-and-design-jerusalem/profile?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0004d7f56a0400b0000000001%2F20240715%2Fus-west-000%2Fs3%2Faws4_request&X-Amz-Date=20240715T004020Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=c0f00b4e5f4b53fd3207ad596cf269f4ecf465dc35d7a837fd13f376bf0d7678"
    }
  ],
  "languages": [],
  "accomplishment_organisations": [],
  "accomplishment_publications": [],
  "accomplishment_honors_awards": [],
  "accomplishment_patents": [
    {
      "title": "Aggregation and Analysis of Media Content Information",
      "issuer": "US",
      "description": "Disclosed are the method and apparatus for collecting and analyzing media content metadata. The technology retrieves web documents referencing media objects from web servers. Metadata of the media objects such as global tags and category weight values are generated from the web documents. Affinity values between user identities and the media objects are generated based on online behaviors of the users interacting with the media objects. Based on the affinity values and metadata of the media objects, the technology can provide recommendations of media objects.\n",
      "application_number": null,
      "patent_number": null,
      "url": "http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=4&f=G&l=50&co1=AND&d=PG01&s1=%22deja.io%22.AS.&OS=AN/%22deja.io%22&RS=AN/%22deja.io%22"
    },
    {
      "title": "Seamless Media Navigation",
      "issuer": "US",
      "description": "Disclosed are the technology for seamless media navigation. A computing device according to the technology includes a processor, a network interface, a input device (e.g. touch screen) and a media navigation module. The network interface communicates with multiple media servers. The input device generates user input signals of swipe motions. The media navigation module configured, when executed by the processor, to perform a process. The process includes playing a first media object, gradually switching from playing the first media object to playing multiple media objects including the first media object based on a first swipe motion; and gradually switching from playing the multiple media objects to playing one individual media object of the media objects based on a second swipe motion subsequent to the first swipe motion.\n",
      "application_number": null,
      "patent_number": null,
      "url": "http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=1&f=G&l=50&co1=AND&d=PG01&s1=%22deja.io%22.AS.&OS=AN/%22deja.io%22&RS=AN/%22deja.io%22"
    },
    {
      "title": "Media Recommendation based on Media Content Information",
      "issuer": "US",
      "description": "Disclosed are the method and apparatus for recommending media objects based on media object metadata. The technology generates media content metadata that relate to contents of a plurality of media objects from a plurality of web documents. The web documents reference one or more of the media objects. The technology further determines feature vectors of the media objects. The elements of the feature vectors comprise values of the media content metadata. The technology then calculates a distance in a feature vector space between a first feature vector of a first media object of the media objects and a second feature vector of a second media object of the media objects, and transmits a recommendation of the second media object based on the distance between the first and second feature vectors.",
      "application_number": null,
      "patent_number": null,
      "url": "http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=3&f=G&l=50&co1=AND&d=PG01&s1=%22deja.io%22.AS.&OS=AN/%22deja.io%22&RS=AN/%22deja.io%22"
    },
    {
      "title": "Pro-Buffering Proxy for Seamless Media Object Navigation",
      "issuer": "US",
      "description": "Disclosed are the method and apparatus for pre-caching contents of online media objects. A proxy running on a computing device determines a first media object that a media navigation application running on the computing device is playing and one or more second media objects that relates to the first media object. The proxy retrieves from one or more content servers data of the first media object and the one or more second media objects on behalf of the media navigation application. The proxy stores the data of the first media object and the one or more second media objects in a buffer of the computing device, and satisfy a data request for the first media object or the one or more second media objects from the media navigation application by supplying the data stored in the buffer to the media navigation application.\n",
      "application_number": null,
      "patent_number": null,
      "url": "http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=2&f=G&l=50&co1=AND&d=PG01&s1=%22deja.io%22.AS.&OS=AN/%22deja.io%22&RS=AN/%22deja.io%22"
    },
    {
      "title": "Normalization of Media Object Metadata",
      "issuer": "US",
      "description": "Disclosed is the technology for normalizing media object metadata. The technology receives a plurality of web documents from web servers. The web documents reference one or more media objects. Then the technology extracts content tags from the web documents, wherein the content tags relate to contents of the media objects. The technology determines a set of media object metadata based on the content tags. The set of media object metadata provides a consistent way of describing the contents of the media objects. For at least some of the media objects, the technology stores the set of media object metadata and the values associated with the media object metadata in a media content database.\n",
      "application_number": null,
      "patent_number": null,
      "url": "http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=5&f=G&l=50&co1=AND&d=PG01&s1=%22deja.io%22.AS.&OS=AN/%22deja.io%22&RS=AN/%22deja.io%22"
    }
  ],
  "accomplishment_courses": [],
  "accomplishment_projects": [],
  "accomplishment_test_scores": [],
  "volunteer_work": [],
  "certifications": [],
  "connections": 1243,
  "people_also_viewed": [
    {
      "link": "https://www.linkedin.com/in/kenzamkow?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAAYpngBXyVXw2Dje16Jw2cVHvEeCQxF3Ds",
      "name": "Ken Zamkow",
      "summary": "Business Development Exec in Tech / AI. Led sales and GTM for 3 acquired startups ($1Bn cumulative exits)",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/roeid?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAArB7sEBg5eJPmoEGXgyprGOO-lHzWM2NWc",
      "name": "Roei Deutsch",
      "summary": "Entrepreneur 🥥 Marketeer for complex SaaS products 🍍 Angel investor 🌱 Forbes Under 30",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/jeremyjonker?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAABTZnIBJO9E0CTJ3o3GOxPzEeyfkkGs4rI",
      "name": "Jeremy Jonker",
      "summary": "Co-Founder and Managing Partner at Infinity Ventures",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/mackfranziska?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAACM8szIBCYdTLMs4MVgx7vRid9bbrSKLDxs",
      "name": "Franziska Mack",
      "summary": "Software Engineer",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/ruthblader?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAD5GDgBbQYxPM2yxGcF_yyJhi_jEqf2enM",
      "name": "Ruth Foxe Blader",
      "summary": "Venture Capital Investor",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/dori-yona-b8369877?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABBMDZMBajMlfSZJWGkH7PwEaEkVyG1qGSk",
      "name": "Dori Yona",
      "summary": "Co-Founder, CEO at SimpleClosure",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/amirshub?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAABEsUB6F74JJWw9cbkfStILZd054yyURc",
      "name": "Amir Shub",
      "summary": "Democratizing Microsite creation | Founder and CEO",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/brendan-mahony-72929385?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABIEWVEBq2dWdSPLWHC2GpLW_NJ8vRF137s",
      "name": "Brendan Mahony",
      "summary": "Founder & CEO at Sunset",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/uptown4?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAADZVowBgiMgxDzb7AxOBAP-V6dPB6IuM1k",
      "name": "Ben Hornedo",
      "summary": "Founder/Technical Lead/Systems Architect/Mentor at Uptown4",
      "location": null
    },
    {
      "link": "https://www.linkedin.com/in/rexsalisbury?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAATEdb8Br5m6evO9Wjne0hGOblrDcubik00",
      "name": "Rex Salisbury",
      "summary": "Solo-GP @ Cambrian (pre-seed & seed fintech), ex A16Z (Partner - Fintech)",
      "location": null
    }
  ],
  "recommendations": [],
  "activities": [],
  "similarly_named_profiles": [],
  "articles": [],
  "groups": [
    {
      "profile_pic_url": "https://media.licdn.com/dms/image/C4D07AQESIdzfU52Mfg/group-logo_image-shrink_400x400/0/1630997765797?e=1720407600&v=beta&t=WRVDNuXt-3TH5hXqG0paCxtvAKRuGL2v1vuzgvU2sUw",
      "name": "Innovation Leaders Club",
      "url": "https://www.linkedin.com/groups/9062777"
    },
    {
      "profile_pic_url": "https://media.licdn.com/dms/image/C4D07AQFF5ejZr6kzOg/group-logo_image-shrink_400x400/0/1651580188065?e=1720407600&v=beta&t=5bveJmWb78Sw8sXM72GKAW0JhWxXbo-Gph2mH6wUPSQ",
      "name": "MEET Community",
      "url": "https://www.linkedin.com/groups/4074540"
    }
  ],
  "skills": [
    "Product Ideation",
    "Engineering Management",
    "Information Technology",
    "React.js",
    "TypeScript",
    "Front-End Development",
    "Computer Vision",
    "Computer Science",
    "Linux",
    "Objective-C",
    "Java",
    "Ruby on Rails",
    "HTML 5",
    "Algorithm Design",
    "Interaction Design",
    "Human Computer Interaction",
    "Python",
    "Perl",
    "Video",
    "Flash",
    "User Experience",
    "Contemporary Art",
    "MySQL",
    "Web Development",
    "Mobile Applications",
    "Programming",
    "JavaScript",
    "Software Development",
    "OOP",
    "User Interface Design",
    "Object Oriented Design",
    "User Interface",
    "ActionScript",
    "Redis",
    "Node.js",
    "Lua",
    "C++",
    "Image Processing",
    "Physical Computing",
    "Shell Scripting",
    "Software Engineering",
    "Software Design",
    "iOS development",
    "Web Applications",
    "Ruby",
    "Git",
    "Distributed Systems",
    "Android",
    "HTML5",
    "Barista"
  ],
  "inferred_salary": {
    "min": null,
    "max": null
  },
  "gender": null,
  "industry": null,
  "interests": [],
  "extra": {
    "github_profile_id": null,
    "facebook_profile_id": null,
    "twitter_profile_id": null
  },
  "personal_emails": [
    "nimrod@meet.csail.mit.edu",
    "nimrod@riskified.com"
  ],
  "personal_numbers": []
};

function App() {
  const [formError, setFormError] = useState(null);
  const [data, setData] = useState(DUMMY_DATA);

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
              <Button
                disabled={isSubmitting || !isDirty}
                kind="ghost"
                onClick={() => reset(undefined, { keepDefaultValues: true })}
                type="button"
              >
                Clear
              </Button>
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
                <View style={styles.header}>
                  <Text style={styles.heading}>{data.full_name}</Text>
                  <Text>{data.experiences[0].title}</Text>
                  <View style={styles.split}>
                    {data?.personal_emails?.[0] ? <Text>{data.personal_emails[0]}</Text> : null}
                    {data?.personal_numbers?.[0] ? <Text>{data.personal_numbers[0]}</Text> : null}
                    {data?.public_identifier ? <Text>https://www.linkedin.com/in/{data.public_identifier}/</Text> : null}
                  </View>
                </View>
                <View style={styles.section}>
                  <Text style={styles.heading}>Summary</Text>
                  <Text>{data.summary}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.heading}>Skills</Text>
                  <Text>{data.skills.join(', ')}</Text>
                </View>
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
                {withEducation ? (
                  <View style={styles.section}>
                    <Text style={styles.heading}>Education</Text>
                    {data.education.map((entry) => (
                      <View key={entry.school} style={styles.subsection}>
                        <Text style={styles.subheading}>{entry.school}</Text>
                        <Text>{entry.field_of_study} ({entry.degree_name})</Text>
                        <Text>
                          {entry?.starts_at?.month ? `${String(entry.starts_at.month).padStart(2, '0')}/${entry.starts_at.year}` : null}
                          {' '}–{' '}
                          {entry?.ends_at?.month ? `${String(entry.ends_at.month).padStart(2, '0')}/${entry.ends_at.year}` : <>Current</>}
                        </Text>
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
