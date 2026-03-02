package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class is a Client component within the system.
 * <p>
 * This annotation serves as a specialization of {@code @Component}, allowing
 * for beans of this type to be detected and automatically registered in the
 * Spring container during component scanning. By using this annotation,
 * developers can semantically distinguish classes that represent client
 * components in the application architecture.
 * <p>
 * This annotation can be applied to any class at the type level. Optionally,
 * a name for the component can be specified through the {@code value} attribute.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Client {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";

}
