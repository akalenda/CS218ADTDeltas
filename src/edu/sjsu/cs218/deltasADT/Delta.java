package edu.sjsu.cs218.deltasADT;

import com.google.appengine.labs.repackaged.com.google.common.base.Joiner;
import com.google.appengine.labs.repackaged.com.google.common.base.Pair;
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

    @Id private Long id; // AppEngine's DataStore automagically populates this
    @Parent private final Key<DeltaRepository> repo;
    @Index private final Date date;
    private final String command;

    public Delta(String repoName, String data) {
        Pair<Date, String> timestampAndDeltas = extractTimestampFrom(data);
        this.repo = Key.create(DeltaRepository.class, repoName);
        this.date = timestampAndDeltas.first;
        this.command = timestampAndDeltas.second;
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
        return Long.toString(date.getTime(), 36) + command;
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
                .ancestor(repo)
                //.order("date")
                .list();
        return deltas;
    }

    public static String loadToString(String repoName) {
        return Joiner.on(" ").join(load(repoName));
    }

    /* ******************************* Helpers *******************************************/
    public Pair<Date, String> extractTimestampFrom(String data) {
        try {
            StringBuilder timestamp = new StringBuilder();
            for(int i=0; i<data.length(); i++) {
                char currChar = data.charAt(i);
                if (currChar == '=')
                    return Pair.of(new Date(Long.valueOf(timestamp.toString(), 36)), data.substring(i+1));
                timestamp.append(currChar);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException(extractTimestamp_exceptionText(data));
        }
        throw new IllegalArgumentException(extractTimestamp_exceptionText(data));
    }

    public String extractTimestamp_exceptionText(String data) {
        return "Argument does not appear to be of the form '123=...', where "
                + "'123' is a base-36 integer timestamp and '=...' is a delta of some kind. Given argument is as "
                + "follows: '" + data + "'";
    }
}
