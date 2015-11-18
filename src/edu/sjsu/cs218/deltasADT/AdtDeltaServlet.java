package edu.sjsu.cs218.deltasADT;

import com.googlecode.objectify.Key;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AdtDeltaServlet extends HttpServlet {

    private static Key<DeltaRepository> repoKey = Key.create(DeltaRepository.class, "ADT");

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        resp.getWriter().print("Hola mis amigos!");
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    }
}
