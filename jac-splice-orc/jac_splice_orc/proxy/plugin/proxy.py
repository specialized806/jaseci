"""JAC Splice-Orchestrator Plugin."""

from jaclang.cli.cmdreg import cmd_registry

from pluggy import HookimplMarker

hookimpl = HookimplMarker("jac")


class ProxyPlugin:
    """Jac module proxy plugin."""

    @staticmethod
    @hookimpl
    def create_cmd() -> None:
        """Create Jac CLI commands."""

        @cmd_registry.register
        def verify() -> bool:
            """Verify Installation."""
            return True
