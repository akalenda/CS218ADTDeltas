package edu.sjsu.cs218.deltasADT;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

import javax.servlet.ServletContextListener;
import javax.servlet.ServletContextEvent;

public class ObjectifyHelper {

    /**
     * OfyHelper, a ServletContextListener, is setup in web.xml to run before a JSP is run.  This is
     * required to let JSP's access Ofy.
     **/
    public class OfyHelper implements ServletContextListener {
        public void contextInitialized(ServletContextEvent event) {
            // This will be invoked as part of a warmup request, or the first user request if no warmup request.
            ObjectifyService.register(Delta.class);
        }

        public void contextDestroyed(ServletContextEvent event) {
            // App Engine does not currently invoke this method.
        }
    }
}
