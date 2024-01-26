import React from 'react';
import { styled } from '@mui/styles';
import { TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LINKS_LIST } from '../../constants';
import {
  Instagram as InstagramIcon,
  Telegram as TelegramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Reddit as RedditIcon,
  Facebook as FacebookIcon,
  GitHub as GithubIcon,
  LinkedIn as LinkedinIcon,
} from '@mui/icons-material';
import { ReactComponent as DiscordIconOriginal } from '../../assets/images/discord.svg';
import { ReactComponent as NFTLogo } from '../../assets/images/NFTLogo.svg';
import { ReactComponent as FooterShapeBottom } from '../../assets/images/footerShapeBottom.svg';
import { renderToStaticMarkup } from 'react-dom/server';
import { Divider } from '../StyledComponents';
import { useMedia } from 'react-use';

const Container = styled('div')(({ theme, shape, logo }) => ({
  height: '603px',
  width: '100%',

  backgroundImage: shape + ',' + logo,
  backgroundColor: theme.palette.footer.background,
  backgroundPosition: 'right -5px bottom -15px, right 90px bottom 30px',
  backgroundRepeat: 'no-repeat',
  bottom: 0,
  zIndex: 1500,

  '@media(max-width: 1440px)': {
    height: '780px',
  },

  '@media(max-width: 720px)': {
    height: '1100px',
    backgroundPosition: 'right -5px bottom -15px, right 50% bottom 30px',
  },

  '@media(max-width: 380px)': {
    height: '1150px',
    backgroundPosition: 'right -5px bottom -15px, left 20% bottom 30px',
  },
}));

const Layout = styled('div')(({ theme, background }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '40px 110px 40px 110px',

  '@media(max-width: 720px)': {
    margin: '30px 40px',
  },
}));

const SignupContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: '20px',

  '@media(max-width: 1440px)': {
    flexDirection: 'column',
    paddingBottom: '5px',
  },
}));

const MailingTextContainer = styled('div')(({ theme }) => ({
  width: '387px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',

  '@media(max-width: 1440px)': {
    width: '100%',
    alignItems: 'center',
  },
}));

const EmailContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '50px',
  marginTop: '25px',

  '@media(max-width: 720px)': {
    marginLeft: '0px',
  },
}));

const MailingListInput = styled(TextField)(({ theme }) => ({
  width: '358px',
  height: '45px',

  backgroundColor: 'white',
  borderRadius: '10px',
  marginRight: '20px',
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
    fontSize: '15px',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    height: '48px',
    borderRadius: '10px',
    border: `1px solid ${theme.palette.border.lighter}`,
  },

  '@media(max-width: 720px)': {
    width: '180px',
    marginRight: '5px',
  },
}));

const LinksContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '50px',
  gap: '50px',

  '@media(max-width: 1440px)': {
    justifyContent: 'space-between',
  },
}));

const ListArea = styled('div')(({ theme }) => ({
  minWidth: '125px',

  '@media(max-width: 720px)': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const MultipleListArea = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
}));

const LargeHeading = styled('p')(({ theme }) => ({
  fontFamily: 'Poppins-bold',
  fontSize: '20px',
  fontWeight: 900,
  color: theme.palette.text.white,
  margin: '0px',
}));

const Heading = styled('p')(({ theme }) => ({
  fontFamily: 'Poppins-bold',
  fontSize: '16px',
  fontWeight: 400,
  color: theme.palette.text.white,
  margin: '0px 0px 14px 0px',
}));

const Main = styled('p')(({ theme }) => ({
  fontFamily: 'Poppins-thin',
  fontSize: '15px',
  fontWeight: 800,
  color: theme.palette.text.white,
  opacity: 0.6,

  '@media(max-width: 720px)': {
    textAlign: 'center',
  },
}));

const LinkCustom = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.white,

  ':hover': {
    textDecorationColor: 'black',
    cursor: 'pointer',
    opacity: 1,
  },
}));

const CommunityHeading = styled(Heading)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',

  '@media(max-width: 1440px)': {
    justifyContent: 'center',
  },
}));

const CommunityListDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',

  '& a': {
    color: theme.palette.text.white,
    transition: '0.5s',
    opacity: 0.6,
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
  },

  '@media(max-width: 1440px)': {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));

const DiscordIcon = styled(DiscordIconOriginal)(({ theme }) => ({
  fill: theme.palette.text.white,
  width: 20,

  '&:hover': {
    fill: theme.palette.primary.main,
  },
}));

const ListRender = ({ list, include, heading = 'hello' }) => {
  return (
    <ListArea>
      <Heading>{heading}</Heading>
      {include.map((item) => {
        return (
          <Main key={list[item]?.name} style={{ margin: '5px 0px' }}>
            <LinkCustom href={list[item]?.link} target="_blank" rel="noopener noreferrer">
              {list[item]?.name}
            </LinkCustom>
          </Main>
        );
      })}
    </ListArea>
  );
};

const CommunityList = ({ socialMediaLinks }) => {
  return (
    <ListArea>
      <CommunityHeading>Community</CommunityHeading>
      <CommunityListDiv>
        {socialMediaLinks.map((media) => {
          return (
            <a key={media.name} rel="noopener noreferrer" target="_blank" href={media.link}>
              {media.icon}
            </a>
          );
        })}
      </CommunityListDiv>
    </ListArea>
  );
};

/********************  Main Component  ********************/
const Footer = () => {
  const theme = useTheme();
  const marketplaceLinkKeys = [
      'allNFTs',
      'new',
      'art',
      'domainNames',
      'virtualWorlds',
      'tradingCards',
      'collectibles',
      'sports',
      'utility',
    ],
    accountLinkKeys = ['profile', 'favorites', 'myCollectibles', 'settings'],
    companyLinkKeys = ['website', 'joinOurTeam', 'contactUs'],
    resourcesLinkKeys = ['docs', 'blog', 'partners', 'website', 'documentation', 'github'],
    statsLinkKeys = ['rankings', 'activity'],
    socialMediaLinks = [
      { ...LINKS_LIST['twitter'], icon: <TwitterIcon /> },
      { ...LINKS_LIST['telegram'], icon: <TelegramIcon /> },
      { ...LINKS_LIST['instagram'], icon: <InstagramIcon /> },
      { ...LINKS_LIST['youtube'], icon: <YouTubeIcon /> },
      { ...LINKS_LIST['facebook'], icon: <FacebookIcon /> },
      { ...LINKS_LIST['reddit'], icon: <RedditIcon /> },
      { ...LINKS_LIST['github'], icon: <GithubIcon /> },
      { ...LINKS_LIST['linkedin'], icon: <LinkedinIcon /> },
      { ...LINKS_LIST['discord'], icon: <DiscordIcon /> },
    ];

  const below1440 = useMedia('(max-width: 1440px)');
  const below720 = useMedia('(max-width: 720px)');

  // for background image bottom right - energiLogo
  const svgStringShape = encodeURIComponent(
    renderToStaticMarkup(<FooterShapeBottom width="97" height="114" />),
  );
  const shape = `url("data:image/svg+xml,${svgStringShape}")`;

  // for background image bottom right - energiLogo
  const svgStringLogo = encodeURIComponent(
    renderToStaticMarkup(<NFTLogo width="195" height="42.5" />),
  );
  const logo = `url("data:image/svg+xml,${svgStringLogo}")`;

  return (
    <Container shape={shape} logo={logo}>
      <Layout>
        <SignupContainer>
          <MailingTextContainer>
            <LargeHeading>
              <strong>Stay in the loop</strong>
            </LargeHeading>
            <Main>
              Join our mailing list to stay in the loop with our newest feature releases, NFT drops,
              and tips and tricks for navigating Energi NFT.
            </Main>
          </MailingTextContainer>

          <EmailContainer>
            <MailingListInput placeholder="Your email address"></MailingListInput>
            <Button
              variant="contained"
              sx={{
                fontWeight: 800,
                width: '126px',
                height: '45px',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.white,
              }}
              color="primary"
            >
              Sign Up
            </Button>
          </EmailContainer>
        </SignupContainer>
        <Divider style={{ margin: below1440 ? '40px 0px' : '0px' }} />

        {below1440 && <CommunityList socialMediaLinks={socialMediaLinks} heading={'Community'} />}
        {!below720 && (
          <LinksContainer>
            <ListRender list={LINKS_LIST} include={marketplaceLinkKeys} heading={'Marketplace'} />
            <MultipleListArea>
              <ListRender list={LINKS_LIST} include={accountLinkKeys} heading={'My Account'} />
              <ListRender list={LINKS_LIST} include={statsLinkKeys} heading={'Stats'} />
            </MultipleListArea>
            <ListRender list={LINKS_LIST} include={resourcesLinkKeys} heading={'Resources'} />
            <ListRender list={LINKS_LIST} include={companyLinkKeys} heading={'Company'} />
            {!below1440 && (
              <CommunityList socialMediaLinks={socialMediaLinks} heading={'Community'} />
            )}
          </LinksContainer>
        )}

        {below720 && (
          <LinksContainer>
            <MultipleListArea>
              <ListRender list={LINKS_LIST} include={marketplaceLinkKeys} heading={'Marketplace'} />
              <ListRender list={LINKS_LIST} include={accountLinkKeys} heading={'My Account'} />
            </MultipleListArea>
            <MultipleListArea>
              <ListRender list={LINKS_LIST} include={resourcesLinkKeys} heading={'Resources'} />
              <ListRender list={LINKS_LIST} include={companyLinkKeys} heading={'Company'} />
              <ListRender list={LINKS_LIST} include={statsLinkKeys} heading={'Stats'} />
            </MultipleListArea>
            {!below1440 && (
              <CommunityList socialMediaLinks={socialMediaLinks} heading={'Community'} />
            )}
          </LinksContainer>
        )}
      </Layout>
    </Container>
  );
};

export default Footer;
