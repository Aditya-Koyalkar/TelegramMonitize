"use client";

import { SERVER_DOMAIN } from "@/utils/env";
import { io } from "socket.io-client";

const socket = io(SERVER_DOMAIN);

export default socket;
