import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CardActions,
  CardContent,
  List,
  ListItem,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Typography,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { FaCode, FaMagic } from "react-icons/fa";
import BottomCard from "../components/BottomCard";
import GradientButton from "../components/GradientButton";
import LinkInput from "../components/LinkInput";
import instance from "./../config/axiosInstance.js";
import { keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LightButton from "../components/LightButton";
import { Context } from "../context/Context";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const web3Ideas = [
  "Decentralized Voting System",
  "NFT Marketplace",
  "Decentralized Social Media Platform",
  "DAO Management Tool",
  "Decentralized Finance (DeFi) Lending Platform",
];

const steps = [
  {
    id: 1,
    text: "Share your website URL.",
  },
  {
    id: 2,
    text: "Receive tailored suggestions on integrating web3 seamlessly.",
  },
  {
    id: 3,
    text: "Get a one-click deploy contract for swift implementation.",
  },
];
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

function Home() {
  const navigate = useNavigate();
  // const defaultLink = document.querySelector("rt").value;
  const [inputLink, setInputLink] = useState("");
  const isTest = React.useContext(Context);
  console.log("isTest", isTest);
  const handleIdeaClick = (idea) => {
    navigate(`/generate/${idea}`);
  };
  const [loading, setLoading] = useState(false);

  const handleMagicButtonClick = async () => {
    setLoading(true);
    try {
      if (isTest) {
        // Simulate a 7-second loading delay if isTest is true
        await new Promise((resolve) => setTimeout(resolve, 7000));
      }

      const { data } = await instance.post("/getOptions", {
        url: inputLink, // Adjusted field name to match backend
      });

      if (data.success && data.data) {
        // Handle the success case

        const jsonData = JSON.parse(data.data);
        const ideas = Object.keys(jsonData);
        console.log(ideas);

        const ideaSummary = Object.values(jsonData);
        navigate("/options", {
          state: {
            // Adjust according to the actual data structure if needed
            options: ideas,
            summary: ideaSummary,
            url: inputLink,
          },
        });
      } else {
        console.error("Error in response data:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="column"
      width="80%"
      mx="auto"
      height="calc(100vh - 4rem)"
    >
      <Box width="70%" mx="auto" pt={4} mb={3}>
        <img
          src="home.svg"
          style={{
            display: "block",
            width: "300px",
            margin: "auto",
          }}
          alt="Web2 --> Web3"
        />
        <LinkInput
          defaultValue={isTest ? inputLink : ""}
          isDisabled={false}
          value={inputLink}
          onChange={(e) => setInputLink(e.target.value)}
        />
        <Typography align="center" variant="body1">
          Unfolding the path to Web3 in a single click!!!
        </Typography>
      </Box>
      <BottomCard
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "95%",
          borderRadius: "2rem",
          paddingTop: "0.5rem",
          paddingBottom: "1rem",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            height: "26rem",
            borderRadius: "2rem",
            transition: "opacity 1s ease-in-out", // Add a smooth transition effect
          }}
        >
          {loading ? (
            <>
              <Typography variant="h6" mb={2} fontWeight={700} align="center">
                Generating ideas!
              </Typography>
              <LinearProgress
                sx={{ width: "30%", borderRadius: "1rem", mt: 2 }}
              />
            </>
          ) : (
            <>
              <Stepper
                activeStep={-1}
                orientation="vertical"
                sx={{
                  color: "white",
                  overflow: "auto",
                }}
              >
                {steps.map(({ id, text }) => {
                  return (
                    <Step key={id}>
                      <StepLabel color="white">
                        <Typography variant="h6" color="white">
                          {text}
                        </Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <CardActions
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "100%",
                }}
              >
                <GradientButton
                  icon={<FaMagic />}
                  text="Start the Magic!"
                  onClick={handleMagicButtonClick}
                  disabled={loading}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "60%",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "coloumn",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "auto",
                    }}
                  >
                    <Divider
                      sx={{ bgcolor: "white", width: "40%", height: "1px" }}
                    ></Divider>
                    <Typography variant="body2" fontSize={18} px={1}>
                      or
                    </Typography>
                    <Divider
                      sx={{ bgcolor: "white", width: "40%", height: "1px" }}
                    ></Divider>
                  </Box>
                  <LightButton
                    component={Link}
                    to={`/editor`}
                    text="Open in code editor"
                    icon={<FaCode />}
                    fullWidth
                  />
                </Box>
              </CardActions>
            </>
          )}
        </CardContent>

        <Box width="70%" mx="auto" mt={4}>
          <Typography variant="h4" align="center" mb={2}>
            Explore Web3 App Ideas
          </Typography>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Web3 App Ideas
                </th>
              </tr>
            </thead>
            <tbody>
              {web3Ideas.map((idea, index) => (
                <tr
                  key={index}
                  onClick={() => handleIdeaClick(idea)}
                  style={{ cursor: "pointer", borderBottom: "1px solid #ddd" }}
                >
                  <td style={{ padding: "10px" }}>{idea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </BottomCard>
    </Box>
  );
}

export default Home;
