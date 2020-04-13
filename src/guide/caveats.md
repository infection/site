---
title: Caveats
type: guide
order: 10
---

## Mutations must occur when CodeCoverage has already started

It may happen that a mutation that fails a test isn't reported as covered.
This can occur when the code-coverage profiler hasn't started before the mutations occurs.
Take for example:

```php
class SourceClassTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @dataProvider instancesProvider
     */
    public function testAlwaysTrueFromFactoryMethod(SourceClass $class): void
    {
        self::assertTrue($class->getValue());
    }

    public function instancesProvider(): array
    {
        return [
            [SourceClass::factoryMethod()],
        ];
    }
}

class SourceClass
{
    private bool $value;

    private function __construct(bool $value)
    {
        $this->value = $value;
    }

    public static function factoryMethod(): self
    {
        return new self(true);
    }

    public function getValue(): bool
    {
        return $this->value;
    }
}
```

If the `TrueValue` [Boolean Substitution](/guide/mutators.html#Boolean-Substitution) mutator is active, you
would expect the mutation to be correctly covered. But in the provided example the mutation
occurs in the `@dataProvider` which runs before the code-coverage driver gets started.

Be sure to check your mutated code runs inside the test in this case, so a workaround can be the following:

```php
class SourceClassTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @dataProvider instanceFactoriesProvider
     */
    public function testAlwaysTrueFromFactoryMethod(callable $classFactory): void
    {
        $class = $classFactory();
        self::assertTrue($class->getValue());
    }

    public function instanceFactoriesProvider(): array
    {
        return [
            [static function() {
                return SourceClass::factoryMethod();
            }],
        ];
    }
}
```
