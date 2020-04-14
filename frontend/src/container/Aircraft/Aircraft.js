import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Typography, Box, AppBar } from "@material-ui/core";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import "./Aircraft.css";
import { wordCapitalization } from "../../scripts/wordManipulation.js"

//from: https://material-ui.com/components/tabs/

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className="detailContainer"
      {...other}
    >
      {value === index && (
        <Box p={3} className="detailContainer-box">
          {children}
        </Box>
      )}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.main,
    minWidth: "15%"
  }
}));

const TabWrapper = ({ condition, children }) =>
  condition ? (
    children
  ) : (
    <AppBar position="static" color="transparent">
      {children}
    </AppBar>
  );

export const Aircraft = ({ connected }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [data, setData] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 600 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth > 600 && isMobile) {
        setIsMobile(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return _ => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  React.useEffect(() => {
    if (!connected) {
      const maintTypes = ["A", "B", "C", "D"]
      setData(
        new Array(20).fill({
          description: {
            aircraft: "Boeing 787-8 Dreamliner",
            tailNumber: "G-ZBJG",
            image: "https://cdn.jetphotos.com/full/6/27290_1582395615.jpg"
          },
          maintenanceSchedule: maintTypes.map(type => {
            return {
              type: type,
              lastCompletedDate: new Date(),
              lastCompletedHours: Math.round(Math.random() * 250),
              maxHours: 250
            }
          }),
          flightHours: Math.round(Math.random() * 250),
          owner: [{company: "british airways", purchaseDate: new Date(), soldDate: null}],
          partsList: [],
          maintainers: [],
          maintenanceReports: []
        })
      );
    }
  }, [connected]);

  return (
    <div
      className={`mainContainer ${
        !isMobile ? "horizontalOrient" : "verticalOrient"
      }`}
    >
      <TabWrapper condition={!isMobile}>
        <Tabs
          orientation={!isMobile ? "vertical" : "horizontal"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          {data.map((obj, index) => (
            <Tab
              label={`Plane ${index + 1}`}
              key={`plane${index}`}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </TabWrapper>
      {data.map((obj, index) => (
        <TabPanel value={value} index={index} key={`aircraft${index}`}>
          <Box m={1} className="panel-header-details">
            <Typography variant="h2">{obj.description.aircraft}</Typography>
            <Typography variant="h6">{`Tail Number: ${obj.description.tailNumber}`}</Typography>
            <Typography variant="h6">{`Company: ${wordCapitalization(obj.owner[obj.owner.length-1].company)} ${index +
              1}`}</Typography>
          </Box>
          <Box className="panel-header-image">
            <img
              src={obj.description.image}
              alt={`${obj.description.aircraft} ${obj.description.tailNumber}`}
            />
          </Box>
          <Box my={1} className="panel-content">
            <Typography variant="h6">Maintenance Checks</Typography>
            <ProgressBar
              start={0}
              end={10}
              current={Math.round(Math.random() * 10)}
              label={`A Check - Last Completed: ${"--"}`}
            />
            <ProgressBar
              start={0}
              end={10}
              current={Math.round(Math.random() * 10)}
              label={`B Check - Last Completed: ${"--"}`}
            />
            <ProgressBar
              start={0}
              end={10}
              current={Math.round(Math.random() * 10)}
              label={`C Check - Last Completed: ${"--"}`}
            />
            <ProgressBar
              start={0}
              end={10}
              current={Math.round(Math.random() * 10)}
              label={`D Check - Last Completed: ${"--"}`}
            />
          </Box>
          <Box my={1} className="panel-content">
            <Typography variant="h6">Parts Provenance</Typography>
          </Box>
          <Box my={1} className="panel-content">
            <Typography variant="h6">Maintenance Reports</Typography>
          </Box>
        </TabPanel>
      ))}
    </div>
  );
};
