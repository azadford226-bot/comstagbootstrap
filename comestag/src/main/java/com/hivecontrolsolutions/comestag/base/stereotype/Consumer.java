package com.hivecontrolsolutions.comestag.base.stereotype;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import java.lang.annotation.*;

/**
 * Indicates that the annotated class serves as a Consumer component in the system.
 * <p>
 * This annotation acts as a specialization of {@code @Component}, enabling automatic
 * detection and registration of the annotated class in the Spring application context
 * during component scanning. It is designed to semantically differentiate Consumer
 * components within the application architecture.
 * <p>
 * The annotation can be applied at the type level and supports an optional {@code value}
 * attribute to specify a custom component name.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Consumer {

    @SuppressWarnings("unused")
    @AliasFor(annotation = Component.class)
    String value() default "";
}
