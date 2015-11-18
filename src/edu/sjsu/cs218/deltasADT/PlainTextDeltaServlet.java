package edu.sjsu.cs218.deltasADT;

import com.googlecode.objectify.ObjectifyService;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class PlainTextDeltaServlet extends HttpServlet{

    private static String REPO_NAME = "PlainText";

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.getWriter().print(Delta.loadToString(REPO_NAME));
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String data = req.getParameter("d");
        Delta.save(REPO_NAME, data);
        resp.getWriter().print("Saved: '" + data + "'");
    }
}
