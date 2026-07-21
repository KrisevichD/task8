"use client"

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";
import { useState } from "react";

import { SIGN_IN_QUERY } from "@/graphql/auth/mutations";
import { useLogin } from "@/hooks/auth/useLogin";
import { FloatingInput } from "@/components/ui/floating-input";

const LoginContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setShowPassword] = useState(false);

    const { login, isLoading, errorText } = useLogin(SIGN_IN_QUERY);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        login({ auth: { email, password } });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            {errorText && (
                <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-3 text-center">
                    {errorText}
                </div>
            )}

            <FloatingInput
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
            />
            <InputGroup>
                <InputGroupInput
                    type={isShowPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton
                        variant="default"
                        size="icon-xs"
                        onClick={() => setShowPassword(!isShowPassword)}
                        disabled={isLoading}
                        title={isShowPassword ? "Hide password" : "Show password"}
                    >
                        <Icon
                            variant="eye"
                            size="sm"
                            className={`transition-colors ${isShowPassword && "text-foreground"
                                }`}
                        />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

            {/* Кнопка отправки формы */}
            <div className="pt-4 flex justify-center">
                <Button
                    type="submit"
                    variant="primary"
                    size="default"
                    disabled={isLoading}
                    className="uppercase font-medium tracking-widest text-sm"
                >
                    {isLoading ? "Logging in..." : "Log In"}
                </Button>
            </div>
        </form>
    );
}

export default LoginContent;
