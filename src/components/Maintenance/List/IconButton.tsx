"use client";
import React from "react";
import { IconButton } from "@mui/material";

type BaseIconProps = {
  onPress: (event: any) => void;
  children: any;
  hoverBgColor?: string;
  disabled?:boolean;
  padding?:string
};

export default function BaseIcon({
  onPress,
  children,
  hoverBgColor = "transparent",
  disabled = false,
  padding = "8px"
}: BaseIconProps) {
  return (
    <IconButton
      color="inherit"
      disabled={disabled}
      aria-label="open drawer"
      onClick={onPress}
      sx={{
        display: "flex",
        justifyContent: "center",
        color:"black",
        padding:padding,
        "&:hover": {
          backgroundColor: hoverBgColor,
        },        
      }}
    >
      {children}
    </IconButton>
  );
}