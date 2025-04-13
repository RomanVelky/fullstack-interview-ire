import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import { Layout } from "@/components/layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <CssBaseline />
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
