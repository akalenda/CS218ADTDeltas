package edu.sjsu.cs218.deltasADT;

import com.google.appengine.labs.repackaged.com.google.common.base.Joiner;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
public class Delta {

    static {
        ObjectifyService.register(Delta.class);
    }

    @Id private Long id;
    @Parent private final Key<DeltaRepository> repo;
    @Index private final Date date;
    private final String command;

    public Delta(String repoName, String data) {
        this.repo = Key.create(DeltaRepository.class, repoName);
        this.date = new Date();
        this.command = data;
    }

    public boolean equals(Delta o) {
        return repo.equals(o.repo)
                && date.equals(o.date)
                && command.equals(o.command);
    }

    @Override
    public boolean equals(Object o) {
        return (o instanceof Delta) && this.equals((Delta) o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(repo, date, command);
    }

    @Override
    public String toString() {
        return command;
    }

    /* ******************************* Tools ******************************************/

    @SuppressWarnings("unused")
    public static final Comparator<Delta> byDate = new Comparator<Delta>() {
        @Override
        public int compare(Delta o1, Delta o2) {
            return o1.date.compareTo(o2.date);
        }
    };

    public static void save(String repoName, String data) {
        Delta delta = new Delta(repoName, data);
        ObjectifyService.ofy().save().entity(delta).now();
    }

    public static List<Delta> load(String repoName) {
        Key<DeltaRepository> repo = Key.create(DeltaRepository.class, repoName);
        List<Delta> deltas = ObjectifyService.ofy().load()
                .type(Delta.class)
                //.ancestor(repo)
                //.order("date")
                .list();
        return deltas;
    }

    public static String loadToString(String repoName) {
        return Joiner.on(" ").join(load(repoName));
    }
}
